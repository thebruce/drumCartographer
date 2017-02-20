'use strict';

const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const csvjson = require('csvjson');
const klaw = require('klaw');
var through2 = require('through2')

module.exports = class {
  constructor(csvKey, csvPathsObj, dest) {
    this.setSrcSuffix(csvKey);
    this.setCsvObject(csvPathsObj);
  }

  makeMap(path, csvObj) {
    return new Promise((res, rej) => {
      // Assembles a drum map for the passed item and writes it.
      // get JSON

      // Create schemePunk scheme

      // get outer config.

      // run schemePunk for outer elements.

      // then get inner config.

      // run schemePunk for inner elements & order for each line in csv.

      // then get new path.
      this.prepareDrmFileName(path)
        .then((newFileName) => {
          // new FileName is the new Path.
        })

      // then convert to xml.

      // then write xml data to new path.


    })
  }

  setCsvObject(csvObj) {
    this.csvObject = csvObj;
  }

  getCsvObject() {
    return this.csvObject;
  }

  setSrcSuffix(srcKey) {
    this.srcSuffix = srcKey;
  }

  getSrcSuffix() {
    return this.srcSuffix
  }

  runOuterScheme() {

  }
  runInnerScheme() {

  }

  /**
   * PrepareDrmFileName.
   *  Transfroms a path from a csv key, the suffix of a path after the src dir, into a destination
   *   drum map path. The dir structure after the src origin dir is maintained.
   *
   * @param {string} oldPath
   *
   * @returns {Promise.string} newPath
   *   The destination path of the Drum map file being produced.
   */
  prepareDrmFileName() {
    return new Promise((res, rej) => {
      const oldPathParsed = path.parse(this.getSrcSuffix());
      const newPath = path.join(this.getDest(), oldPathParsed.dir, `${oldPathParsed.name}.drm`);
      res(newPath);
    });
  }

  writeDrm(path, drmObject) {
    return new Promise((res, rej) => {
      fs.writeFile(path, drmObject)
    })
  }

  getDrumMapTemplate() {
    return new Promise((res, rej) => {
      const basePath = config.get(drumMap.templatePaths.baseTemplate);
      fs.readJson(basePath,  (err, data) => {
        if (err) {
          rej(err);
        }
        else {
          res(data);
        }
      })
    });
  }


  makeDrumMaps() {
    const promises = [];
    return new Promise((res, rej) => {
      const keys = Object.keys(this.getCsvObject());
      keys.forEach((key) => {
        // Call make Map for each item.
        promises.push(this.makeMap());
        // Create a schemePunk item.
      });
      Promise.all(promises)
      .then(() => {
        // console.log
      })
    })

  }

  addDrumMapPromise() {

  }
  getDrumMapPromise() {

  }
  setDrumMapPromise() {

  }
  getMapConfig() {

  }
  convertToXml() {

  }
}

