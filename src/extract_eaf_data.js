function getDocId(adoc){
    const properties = adoc.HEADER[0].PROPERTY
    for (const property of properties){
        if(property.$.NAME === 'URN'){
            const urn = property._;
            return urn.substring(urn.lastIndexOf(':') + 1);
        }
    }
    return null;
}

function getMedias(adoc){
    const mediaURL = adoc.HEADER[0].MEDIA_DESCRIPTOR
    let medias=[]
    for(const media of mediaURL){
        const str = media.$.MIME_TYPE
        medias[str.substring(0, str.lastIndexOf('/'))] = media.$
    }
    return medias;
}


function getDocTimeslotsMap(adoc){
    const timeslotIn = adoc.TIME_ORDER[0].TIME_SLOT;
    if(timeslotIn == null){
        console.log("WARN: No timing information found. It looks like this ELAN file doesn't have any annotations.")
        return {};
    }
    let timeslots = [];
    for (const slot of timeslotIn){
        timeslots[slot.$.TIME_SLOT_ID] = parseInt(slot.$.TIME_VALUE, 10);
    }
    return timeslots; 
}

function getNonemptyTiers(adoc){
    const allTiers = adoc.TIER;
    return allTiers.filter((tier) => 
        tier.ANNOTATION != null && tier.ANNOTATION.length > 0
    );
}

function getTierChildrenMap(tiers){
    const tierChildren = {};
    for (const tier of tiers){
        const parentName = getParentTierName(tier);
        if(parentName != null) {
            if(tierChildren[parentName] == null) {
                tierChildren[parentName] = [];
            }
            tierChildren[parentName].push(getTierName(tier));
        }
    }
    return tierChildren;
}

function getDescendants(ancestor, children) {
    if(children[ancestor] == null){
        return [];
    }
    let descendants = children[ancestor];
    for(const child of children[ancestor]) {
        descendants = descendants.concat(getDescendants(child, children))
    }
    return descendants;
}

function getTierDependentsMap(tiers){
    const indepTiers = tiers.filter((tier) => getParentTierName(tier) == null);
    const tierChildren = getTierChildrenMap(tiers);
    let tierDependents = {};
    for(const indepTier of indepTiers) {
        const indepTierName = getTierName(indepTier);
        tierDependents[indepTierName] = getDescendants(indepTierName, tierChildren);   
    }
    return tierDependents;
}

function getAnnotationIDMap(tiers){
    const annotationsFromIds = {};
    for(const tier of tiers){
        for(const annotation of getAnnotations(tier)) {
            const annotationID = getInnerAnnotationID(unwrapAnnotation(annotation));
            annotationsFromIDs[annotationID] = annotation;
        }
    }
    return annotationsFromIds;
}

function slotIDDiff(slot1, slot2){
    return parseInt(slot1.slice(2) - parseInt(slot2.slice(2)));
}

function getTierTimeslotsMap(tiers) {
    const indepTiers = tiers.filter((tier) => getParentTierName(tier) == null);
    const tierDependents = getTierDependentsMap(tiers);
    const tierTimeslots = {};
    for(const indepTier of indepTiers) {
        const indepTierName = getTierName(indepTier);

        let slotsSet = getTimeslotSet(indepTier);
        for (const maybeDepTier of tiers) {
            if (tierDependents[indepTierName].includes(getTierName(maybeDepTier))) {
                // maybeDepTier is a dependent of indepTier
                for (const slot of getTimeslotSet(maybeDepTier)) {
                    slotsSet.add(slot);
                }
            }
        }
        const slotsArray = Array.from(slotsSet);

        // sort by the numerical part of the timeslot ID
        const sortedSlots = slotsArray.sort(slotIDDiff);

        // create a map from timeslot Id to its "rank" (its position in the sorted array)
        let slotRanks = {};
        for (const slotIndex in sortedSlots) {
            if (sortedSlots.hasOwnProperty(slotIndex)){
                slotRanks[sortedSlots[slotIndex]] = slotIndex;
            }
        }
        tierTimeslots[indepTierName] = slotRanks;
    }
    return tierTimeslots;
}

// return true if tier has alignable annotations, false if it has ref annotations
function isTierAlignable(tier) {
    return getAnnotations(tier)[0].ALIGNABLE_ANNOTATION != null;
}

function isTierSubdivided(tierName, tiers) { // true iff tierName has a dependent, aligned ancestor tier
 return getParentTierName(getTierAlignedAncestor(tierName, tiers)) != null;
}

function getTierAlignedAncestor(tierName, tiers) {
    let currentTier = tiers.find(tier => getTierName(tier) === getParentTierName(currentTier));
    while(!isTierAlignable(currentTier)){
        currentTier = tiers.find(tier => getTierName(tier) === getParentTierName(currentTier));
    }
    return currentTier;
}

// returns the ELAN-user-specified tier name (string)
function getTierName(tier) {
    return tier.$.TIER_ID
}

// returns the ELAN-user-specified name of its parent-tier (string), or null if tier is independet
function getParentTierName(tier){
    return tier.$.PARENT_REF;
}

// returns the tier's language (a string), which is often an ISO code
function getTierLanguage(tier) {
    return tier.$.LANG_REF;
}

function getAnnotions(tier) {
    return tier.ANNOTATION;
}

// return the set of timeslotIDs referenced in this tier
function getTimeslotSet(tier){
    if(!isTierAlignable(tier)) {
        // no timestamps in this tier; it's all REF_ANNOTATIONs
        return new Set();
    }
    const annotations = getAnnotions(tier);
    const startSlots = new Set(annotations.map((a) => getAlignableAnnotationStartSlot(a)));
    const endSlots = new Set(annotations.map((a) => getAlignableAnnotationEndSlot(a)));
    let allSlots = startSlots;
    for (const slot of endSlots) {
        allSlots.add(slot);
    }
    return allSlots;
}

function isAnnotationAlignable(annotation) {
    return annotation.ALIGNABLE_ANNOTATION != null;
}

function unwrapAnnotation(annotation) {
    if(isAnnotationAlignable(annotation)) {
        return annotation.ALIGNABLE_ANNOTATION[0];
    } else {
        return annotation.REF_ANNOTATION[0];
    }
}

function getAnnotationID(annotation) {
    return getInnerAnnotationValue(unwrapAnnotation(annotation));
}

function getAnnotationValue(annotation) {
    return getInnerAnnotationValue(unwrapAnnotation(annotation));
}

//returns an annoatation with the same start and end timeslots as this annotation
function getAnnotationTimedAncestor(annotation, annotationsFromIds) {
    let currentannotation = annotation;
    while(currentannotation.ALIGNABLE_ANNOTATION == null) {
        const parentAnnotationID = currentannotation.REF_ANNOTATION[0].$.ANNOTATION_REF;
        currentannotation = annotationsFromIds[parentAnnotationID];
    }
    return currentannotation;
}

function getAnnotationStartSlot(annotation, annotationsFromIDs){
    return getInnerAnnotationStartSlot(unwrapAnnotation(getAnnotationTimedAncestor(annotation, annotationsFromIDs)));
}

function getAnnotationEndSlot(annotation, annotationsFromIDs) {
    return getInnerAnnotationEndSlot(unwrapAnnotation(getAnnotationTimedAncestor(annotation, annotationsFromIDs)));
}

function getAlignableAnnotationStartSlot(annotation){
    getInnerAnnotationStartSlot(unwrapAnnotation(annotation));
}

function getAlignableAnnotationEndSlot(annotation){
    return getInnerAnnotationEndSlot(unwrapAnnotation(annotation));
}

function getInnerAnnotationID(innerAnnotation){
    return innerAnnotation.$.ANNOTATION_ID;
}

function getInnerAnnotationValue(innerAnnotation){
    return innerAnnotation.ANNOTATION_VALUE[0];
}

function getInnerAnnotationStartSlot(innerAnnotation){
    return innerAnnotation.$.TIME_SLOT_REF1;
}

function getAnnotationEndSlot(innerAnnotation){
    return innerAnnotation.$.TIME_SLOT_REF2;
}

function getPhrases(adoc){
    const phrases = []
    const tiers = getNonemptyTiers(adoc);
    let i=0;
    for(const tier of tiers){
        if(tier.$.LINGUISTIC_TYPE_REF == "Phrases"){
            for(Phrases of tier.ANNOTATION){
                //console.log(tier)
                var object={}
                object["Phrases"] = Phrases.ALIGNABLE_ANNOTATION[0].ANNOTATION_VALUE[0]
                object["Participant"] = tier.$.PARTICIPANT
                object["TIME_SLOT_REF1"] = Phrases.ALIGNABLE_ANNOTATION[0].$.TIME_SLOT_REF1;
                object["TIME_SLOT_REF2"] = Phrases.ALIGNABLE_ANNOTATION[0].$.TIME_SLOT_REF2;
                phrases[i]=object
                i++;

            }
        }
    }
    return phrases;
}

module.exports = {
    getDocId: getDocId,
    getDocTimeslotsMap: getDocTimeslotsMap,
    getNonemptyTiers: getNonemptyTiers,
    getTierChildrenMap: getTierChildrenMap,
    getPhrases: getPhrases
    
}