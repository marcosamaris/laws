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

function getVideoUrl(adoc){
    const medias=getMedias(adoc)
    let str = medias["video"].MEDIA_URL
    for (const char of str.split("")) {
        if(char == " ")
            str = str.replace(" ", "%")
    }
    return str;
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

module.exports = {
    getDocId: getDocId,
    getVideoUrl: getVideoUrl,
    getDocTimeslotsMap: getDocTimeslotsMap,
    getNonemptyTiers: getNonemptyTiers,
    getTierChildrenMap: getTierChildrenMap,
    
}