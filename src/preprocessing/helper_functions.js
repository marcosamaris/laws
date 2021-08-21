function getFilenameFromPath(path) {
  // I/P: path, a string
  // O/P: the filename which occurs at the end of the path
  // Status: untested
  const begin = String(path).lastIndexOf("/") + 1; // @Kalinda, this might fail on windows.
  return String(path).substring(begin, path.length);
}

function getTitleFromFilename(filename) {
  return String(filename).substring(0, String(filename).lastIndexOf('.'));
}

function improveElanIndexData(path, storyID, adoc) {
  // I/P: path, a string
  //      storyID, a string
  //      adoc, an annotation document
  // O/P: a JSON object, based on the index.json file and new metadata
  // Status: untested
  const filename = getFilenameFromPath(path);
  //let metadata = getMetadataFromIndex(storyID);
  let metadata = null;

  const date = new Date();
  const prettyDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

  if (metadata == null) { // file not in index previously
    // below is the starter data:
    metadata = {
      "timed": true,
      "story ID": storyID,
      "title": {
        "_default": getTitleFromFilename(filename),
      },
      "media": {
        "audio": "",
        "video": ""
      },
      "languages": [],
      "date_created": "",
      "date_uploaded": prettyDate,
      "source": {
        "_default": ""
      },
      "description": "",
      "genre": "",
      "author": "",
      "glosser": "",
      "speakers": [],
      "xml_file_name": path,
      "source_filetype": "ELAN"
    };
  }

  // get language info
  let speakers = new Set(); // to avoid duplicates
  const tiers = adoc['TIER'];
  for (const tier of tiers) {
    if (tier['$']['PARTICIPANT']) {
      speakers.add(tier['$']['PARTICIPANT']);
    }
  }
  metadata['speakers'] = Array.from(speakers);

  // fill in any missing audio/video files, if we can
  let linkedMediaPaths = [];
  let mediaDescriptors = adoc['HEADER'][0]['MEDIA_DESCRIPTOR'];
  if (mediaDescriptors != null) { // null happens on ELAN->FLEx->ELAN files
    for (const mediaDesc of mediaDescriptors) {
      linkedMediaPaths.push(mediaDesc['$']['MEDIA_URL']);
    }
  }
  //updateMediaMetadata(filename, storyID, metadata, linkedMediaPaths)

  return metadata;
}

module.exports = {
  getFilenameFromPath: getFilenameFromPath,
  improveElanIndexData: improveElanIndexData
};
