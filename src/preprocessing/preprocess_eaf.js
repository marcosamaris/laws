const {getAlignableAnnotationStartSlot, 
  getAlignableAnnotationEndSlot, getDocID, 
  getNonemptyTiers, getParentTierName, 
  getTierName, isTierSubdivided,
  getAnnotationValue, getAnnotations,
  getAnnotationID, getAnnotationIDMap, 
  getDocTimeslotsMap, getTierSpeakerName, 
  getTierChildrenMap, getTierLanguage} = require('./eaf_utils')

const helper = require('./helper_functions');

function scaledSlot(slotIn, parentStart, tierEnd, latestEnd) {
  const parentLen = latestEnd - parentStart;
  const childLen = tierEnd - parentStart;
  let slot = slotIn - parentStart;
  slot = Math.floor(slot * parentLen / childLen);
  slot = slot + parentStart;
  return slot;
}

function assignSlots(anotID, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  assignSlotsHelper(anotID, 0, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
  // At this point, startSlots and endSlots contain the smallest allowable slot value.
  stretchSlots(anotID, 0, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
}

function assignSlotsHelper(anotID, parentStartSlot, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  startSlots[anotID] = parentStartSlot;
  let latestEndSlot = parentStartSlot + 1;
  for (const depTierName in annotationChildren[anotID]) {
    if (annotationChildren[anotID].hasOwnProperty(depTierName)) {
      let slotNum = parentStartSlot;
      
      let prevTimeslot = null; // used for detecting gaps
      let maybeGaps = (tiersToConstraints[depTierName] === 'Included_In');
      if (maybeGaps) {
        prevTimeslot = getAlignableAnnotationStartSlot(annotationsFromIDs[anotID]);
      }
      
      const depAnotIDs = annotationChildren[anotID][depTierName];
      for (var depAnotID of depAnotIDs) {
        if (maybeGaps) {
          const startTimeslot = getAlignableAnnotationStartSlot(annotationsFromIDs[depAnotID]);
          if (startTimeslot !== prevTimeslot 
            && timeslots[startTimeslot] !== timeslots[prevTimeslot]) {
            slotNum++;  
          }
          prevTimeslot = getAlignableAnnotationEndSlot(annotationsFromIDs[depAnotID]);
        }
        
        assignSlotsHelper(depAnotID, slotNum, tiersToConstraints, annotationChildren, 
            annotationsFromIDs, timeslots, startSlots, endSlots);
        slotNum = endSlots[depAnotID];
        latestEndSlot = Math.max(latestEndSlot, slotNum);
      }
    }
  }
  
  // make parent's end slot at least as late as its child's
  endSlots[anotID] = latestEndSlot;
}

// Stretch children to fill full duration of parent.
// prevStretch: the total increase in the parent's startslot due to stretch
function stretchSlots(anotID, prevStretch, tiersToConstraints,
    annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots) {
  for (const depTierName in annotationChildren[anotID]) {
    if (annotationChildren[anotID].hasOwnProperty(depTierName)) {
      const depAnotIDs = annotationChildren[anotID][depTierName];
      const tierEnd = endSlots[depAnotIDs[depAnotIDs.length - 1]] + prevStretch;
      const parentStart = startSlots[anotID];
      const parentEnd = endSlots[anotID];
      for (var depAnotID of depAnotIDs) {
        const origStart = startSlots[depAnotID];
        const newStart = scaledSlot(origStart + prevStretch, parentStart, tierEnd, parentEnd);
        startSlots[depAnotID] = newStart;
        const scaledEnd = scaledSlot(endSlots[depAnotID] + prevStretch, parentStart, tierEnd, parentEnd);
        endSlots[depAnotID] = scaledEnd;
        stretchSlots(depAnotID, newStart - origStart, tiersToConstraints, 
            annotationChildren, annotationsFromIDs, timeslots, startSlots, endSlots);
      }
    }
  }
}

function preprocess(adocIn, /*pfsxIn,*/ xmlFileName, callback) {
  const storyID = getDocID(adocIn);
  const indexMetadata = helper.improveElanIndexData(xmlFileName, storyID, adocIn);
  //updateIndex(indexMetadata, "data/index.json", storyID);
  //updateIndex(indexMetadata, "data/index.json", storyID);
  const jsonOut = {
    "metadata": indexMetadata,
    "sentences": []
  };
  jsonOut.metadata["tier IDs"] = {};
  jsonOut.metadata["speaker IDs"] = {};
  jsonOut.metadata["story ID"] = storyID; // TODO is this needed?

  const tiers = getNonemptyTiers(adocIn);
  const indepTiers = tiers.filter((tier) => getParentTierName(tier) == null);
  
  // give each tier an ID
  let tierIDsFromNames = {};
  for (let i = 0; i < tiers.length; i++) {
    const newID = "T" + (i + 1).toString();
    const tier = tiers[i];
    const tierName = getTierName(tier);
    jsonOut.metadata["tier IDs"][newID] = {
      name: tierName,
      subdivided: isTierSubdivided(tierName, tiers),
    };
    tierIDsFromNames[tierName] = newID;
  }
  
  // TODO glom morphs if coming from FLEx?
  
  // tiersToConstraints: tierName -> constraintName
  // (to generate, first create typesToConstraints: linguisticTypeName -> constraintName)
  const typesToConstraints = {};
  const linguisticTypes = adocIn.LINGUISTIC_TYPE
  for (const lingType of linguisticTypes) {
    const lingTypeID = lingType.$.LINGUISTIC_TYPE_ID;
    const constraintName = lingType.$.CONSTRAINTS || '';
    typesToConstraints[lingTypeID] = constraintName;
  }
  const tiersToConstraints = {};
  for (const tier of tiers) {
    const tierName = getTierName(tier);
    const linguisticType = tier.$.LINGUISTIC_TYPE_REF;
    const constraintName = typesToConstraints[linguisticType];
    tiersToConstraints[tierName] = constraintName;
  }
  // console.log(`tiersToConstraints: ${tiersToConstraints}`);
  
  const untimedTiers = tiers.filter(tier => 
    (tiersToConstraints[getTierName(tier)] === 'Symbolic_Subdivision' 
    || tiersToConstraints[getTierName(tier)] === 'Symbolic_Association')
  );
  
  // annotationChildren: parentAnnotationID -> childTierName(very sparse) -> listof childAnnotationID
  const annotationChildren = {};
  for (const tier of untimedTiers) {
    const childTierName = getTierName(tier);
    // console.log(`adding untimed child tier ${childTierName} to annotationChildren`);
    for (const annotation of getAnnotations(tier)) {
      const childAnnotationID = getAnnotationID(annotation);
      let parentAnnotationID = annotation.REF_ANNOTATION[0].$.ANNOTATION_REF; 
      if (annotationChildren[parentAnnotationID] == null) {
        annotationChildren[parentAnnotationID] = {}
      }
      if (annotationChildren[parentAnnotationID][childTierName] == null) {
        annotationChildren[parentAnnotationID][childTierName] = [];
      }
      annotationChildren[parentAnnotationID][childTierName].push(childAnnotationID);
    }
  }
  
  const annotationsFromIDs = getAnnotationIDMap(tiers);
  const timeslots = getDocTimeslotsMap(adocIn);
  console.log(timeslots)
  
  // sort untimed children
  for (const parentAnnotationID in annotationChildren) {
    if (annotationChildren.hasOwnProperty(parentAnnotationID)) {
      for (const childTierName in annotationChildren[parentAnnotationID]) {
        const childIDs = annotationChildren[parentAnnotationID][childTierName];
        let sortedChildIDs = [];
        const constraint = tiersToConstraints[childTierName];
        if (constraint === 'Symbolic_Association') { // 1-1 association
          // assert childIDs.length === 1; 
          sortedChildIDs = childIDs;
        } else if (constraint === 'Symbolic_Subdivision') { // untimed subdivision, ordered
          let prev = '';
          for (const id of childIDs) {
            const cur = childIDs.find(a => 
              prev === (annotationsFromIDs[a].REF_ANNOTATION[0].$.PREVIOUS_ANNOTATION || '')
            );
            sortedChildIDs.push(cur);
            prev = cur;
          }
        } else { // this should never happen
          console.log(`WARNING: missing or unrecognized ELAN stereotype for tier ${childTierName}. Annotations may display out of order.`);
          sortedChildIDs = childIDs;
        }
        
        annotationChildren[parentAnnotationID][childTierName] = sortedChildIDs;
      }
    }
  }
  
  const tierChildren = getTierChildrenMap(tiers);
  
  // add sorted 'Time_Subdivision' children
  for (const parentTier of tiers) {
    const childTierNames = tierChildren[getTierName(parentTier)] || [];
    const timeSubdivChildTiers = tiers.filter(tier => 
      tiersToConstraints[getTierName(tier)] === 'Time_Subdivision'
      && childTierNames.find(n => n === getTierName(tier)) != null
    );
    for (const childTier of timeSubdivChildTiers) {
      const childTierName = getTierName(childTier);
      // console.log(`adding time-subdiv child tier ${childTierName} to annotationChildren`);
      const childTierAnots = getAnnotations(childTier);
      for (const parentAnot of getAnnotations(parentTier)) {
        const sortedChildIDs = [];
        let prevSlot = getAlignableAnnotationStartSlot(parentAnot);
        const endSlot = getAlignableAnnotationEndSlot(parentAnot);
        while (prevSlot !== endSlot) {
          const cur = childTierAnots.find(a => 
            prevSlot === getAlignableAnnotationStartSlot(a) || 
            (timeslots[prevSlot] != null && 
            timeslots[prevSlot] === getAlignableAnnotationStartSlot(a)
            )
          );
          if (cur == null) {
            // this parent anot has no children on this tier
            break; // exit the while loop
          }
          const curID = getAnnotationID(cur);
          sortedChildIDs.push(curID);
          prevSlot = getAlignableAnnotationEndSlot(cur);
        }
        
        const parentAnotID = getAnnotationID(parentAnot);
        if (sortedChildIDs.length !== 0) {
          if (annotationChildren[parentAnotID] == null) {
            annotationChildren[parentAnotID] = {}
          }
          annotationChildren[parentAnotID][childTierName] = sortedChildIDs;
        }
      }
    }
  }
  
  // add 'Included_In' children
  for (const parentTier of tiers) {
    const parentTierName = getTierName(parentTier);
    const childTierNames = tierChildren[getTierName(parentTier)] || [];
    const inclChildTiers = tiers.filter(tier => 
      tiersToConstraints[getTierName(tier)] === 'Included_In'
      && childTierNames.find(n => n === getTierName(tier)) != null
    );
    for (const childTier of inclChildTiers) {
      const childTierName = getTierName(childTier);
      // console.log(`adding incl-in child tier ${childTierName} of ${parentTierName} to annotationChildren`);
      const childTierAnots = getAnnotations(childTier);
      for (const parentAnot of getAnnotations(parentTier)) {
        let childIDs = [];
        const parentStartSlot = getAlignableAnnotationStartSlot(parentAnot);
        const parentEndSlot = getAlignableAnnotationEndSlot(parentAnot);
        
        const parentStartMs = timeslots[parentStartSlot];
        const parentEndMs = timeslots[parentEndSlot];
        if (parentStartMs && parentEndMs) { // get children within these ms values
          // console.log(`within ms ${parentStartMs}, ${parentEndMs}?`);
          for (var anot of childTierAnots) {
            const anotID = getAnnotationID(anot);
            const startSlot = getAlignableAnnotationStartSlot(anot);
            const endSlot = getAlignableAnnotationEndSlot(anot);
            // console.log(`  checking child ${anotID}, slots ${startSlot}, ${endSlot}`);
            const startsWithin = (
              timeslots[startSlot] >= parentStartMs 
              && timeslots[startSlot] < parentEndMs
            );
            const endsWithin = (
              timeslots[endSlot] > parentStartMs 
              && timeslots[endSlot] <= parentEndMs
            );
            if (startsWithin || endsWithin) {
              // console.log('  added!');
              childIDs.push(anotID);
            }
          }
          
          // sort by ms value
          childIDs = childIDs.sort((id1,id2) => {
            // if start isn't defined, calculate it based on end, pretending duration is 1 ms
            const a1 = annotationsFromIDs[id1];
            const a2 = annotationsFromIDs[id2];
            const start1 = (
              timeslots[getAlignableAnnotationStartSlot(a1)]
              || timeslots[getAlignableAnnotationEndSlot(a1)] - 1
            );
            const start2 = (
              timeslots[getAlignableAnnotationStartSlot(a2)] 
              || timeslots[getAlignableAnnotationEndSlot(a2)] - 1
            );
            return start1 - start2;
          });
        }
        
        // check for children which share the parent's start or end slot
        for (anot of childTierAnots) {
          const anotID = getAnnotationID(anot);
          const startSlot = getAlignableAnnotationStartSlot(anot);
          const endSlot = getAlignableAnnotationEndSlot(anot);
          if (startSlot === parentStartSlot && anotID !== childIDs[0]) {
            childIDs.splice(0, 0, anotID); // insert at beginning
          } else if (endSlot === parentEndSlot && anotID !== childIDs[childIDs.length - 1]) {
            childIDs.push(anotID);
          } 
        }
        
        // add children which share a boundary with an existing child
        // (but not if they end at the first child or start at the last child)
        let prevIndex = 0;
        while (prevIndex < childIDs.length - 1) {
          const prevID = childIDs[prevIndex];
          const prevAnot = annotationsFromIDs[prevID];
          const prevSlot = getAlignableAnnotationEndSlot(prevAnot);
          
          const nextID = childIDs[prevIndex + 1];
          const nextAnot = annotationsFromIDs[nextID];
          const nextSlot = getAlignableAnnotationStartSlot(nextAnot)
          
          let newAnot = childTierAnots.find(a => 
            getAlignableAnnotationStartSlot(a) === prevSlot
          );
          if (newAnot == null) {
            newAnot = childTierAnots.find(a =>
              getAlignableAnnotationEndSlot(a) === nextSlot
            );
          }
          if (newAnot != null) {
            const newID = getAnnotationID(newAnot);
            if (newID != null && newID != nextID) {
              childIDs.splice(prevIndex + 1, 0, newID); // insert after prevIndex
            }
          }
          
          prevIndex++;
        }
        
        const parentAnotID = getAnnotationID(parentAnot);
        if (!annotationChildren.hasOwnProperty(parentAnotID)) {
          annotationChildren[parentAnotID] = {};
        }
        annotationChildren[parentAnotID][childTierName] = childIDs;
      }
    }
  }
  
  //jsonOut['annotationChildren'] = annotationChildren; // TODO remove when no longer needed for debugging
  
  const anotDescendants = {}; // indepAnotID -> depTierName -> ordered listof anotIDs descended from indepAnot
  for (const indepTier of indepTiers) {
    for (const indepAnot of getAnnotations(indepTier)) {
      const indepAnotID = getAnnotationID(indepAnot);
      const depTiersAnots = {}; // depTierName -> ordered listof anotIDs descended from indepAnot
      let pendingParentIDs = [indepAnotID];
      while (pendingParentIDs.length > 0) {
        const parentID = pendingParentIDs[0];
        pendingParentIDs.shift() // remove parentID from pendingParentIDs
        // add all of parentID's direct children to depTierAnots and to pendingParentIDs
        for (const depTierName in annotationChildren[parentID]) {
          if (annotationChildren[parentID].hasOwnProperty(depTierName)) {
            const childIDs = annotationChildren[parentID][depTierName];
            if (!depTiersAnots.hasOwnProperty(depTierName)) {
              depTiersAnots[depTierName] = [];
            }
            depTiersAnots[depTierName] = depTiersAnots[depTierName].concat(childIDs);
            pendingParentIDs = pendingParentIDs.concat(childIDs);
          }
        }
      }
      anotDescendants[indepAnotID] = depTiersAnots;
    }
  }
  
  
  // careful - garbageTierIDs and tierIDOrder may contain undefined, e.g. if there are empty tiers
  
  for (let i = 0; i < indepTiers.length; i++) {
    const spkrID = "S" + (i + 1).toString(); // assume each independent tier has a distinct speaker
    const indepTierName = getTierName(indepTiers[i]);
    const tierID = tierIDsFromNames[indepTierName];
    
    jsonOut.metadata["speaker IDs"][spkrID] = {
      "name": getTierSpeakerName(indepTiers[i]),
      "language": getTierLanguage(indepTiers[i]),
      "tier": tierID,
    };
    
    for (const indepAnot of getAnnotations(indepTiers[i])) {
      const indepAnotID = getAnnotationID(indepAnot);
      const anotStartSlots = {};
      const anotEndSlots = {};
      assignSlots(indepAnotID, tiersToConstraints, annotationChildren, 
        annotationsFromIDs, timeslots, anotStartSlots, anotEndSlots
      );

      const sentenceJson = {
        "speaker": spkrID,
        "tier": tierID,
        "start_time_ms": parseInt(timeslots[getAlignableAnnotationStartSlot(indepAnot)], 10),
        "end_time_ms": parseInt(timeslots[getAlignableAnnotationEndSlot(indepAnot)], 10),
        "num_slots": anotEndSlots[indepAnotID],
        "text": getAnnotationValue(indepAnot),
        //"anotID": indepAnotID, // TODO remove when no longer needed for debugging
        "dependents": [],
      };

      
      const depTiersAnots = anotDescendants[indepAnotID];
      for (const depTierName in depTiersAnots) {
        if (depTiersAnots.hasOwnProperty(depTierName)) {
          const depTierJson = {
            "tier": tierIDsFromNames[depTierName],
            "values": [],
          };
          
          for (const depAnotID of depTiersAnots[depTierName]) {
            const depAnot = annotationsFromIDs[depAnotID];
            if (!anotStartSlots.hasOwnProperty(depAnotID)) {
              console.log(`oh no, missing annotation!`);
            }
            depTierJson.values.push({
              "start_slot": anotStartSlots[depAnotID],
              "end_slot": anotEndSlots[depAnotID],
              //"anotID": getAnnotationID(depAnot), // TODO remove when no longer needed for debugging
              "value": getAnnotationValue(depAnot),
            });
          }
          // depTierJson is already in order by start_slot, since anotDescendants is ordered
          sentenceJson.dependents.push(depTierJson); 
        }
      }
      
            
      // sort by the numerical part of the tier ID to ensure consistent ordering; TODO delete this line
      // sentenceJson.dependents.sort((t1,t2) => parseInt(t1.tier.slice(1),10) - parseInt(t2.tier.slice(1),10));
          
      jsonOut.sentences.push(sentenceJson);
    }
  }
  jsonOut.sentences.sort((s1,s2) => s1.start_time_ms - s2.start_time_ms);
  
  for (const tier in jsonOut.metadata["tier IDs"]) {
    if (jsonOut.metadata["tier IDs"].hasOwnProperty(tier) /*&& garbageTierIDs.includes(tier)*/) {
      delete jsonOut.metadata["tier IDs"][tier];
    }
  }
  callback(jsonOut)
  
}



module.exports = {
  preprocess: preprocess,
  assignSlots: assignSlots, // TODO remove when no longer needed for debugging
};
