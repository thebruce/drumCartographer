'use strict';

const fs = require('fs-extra');
const path = require('path');
const csvjson = require('csvjson');
const klaw = require('klaw');
var through2 = require('through2')

module.exports = class {
  /**
   * @param {string} src
   *   A string representing a path to a csv file or directory.
   */
  constructor(src) {
    this.setSrc(src);
    this.setPaths({});
  }

  /**
   * setSrc
   *   Sets the src path a valid csv file or directories path to the passed parameter.
   * @param {string} src
   */
  setSrc(src) {
    // Set the src.
    this.src = src;
  }

  /**
   * getSrc()
   *
   * @returns {string} this.src
   *   A string representing a path.
   */
  getSrc() {
    return this.src;
  }

  /**
   * validateSrc
   *   Validates that the passed src Parameter is a valid path to a directory or
   *     file.
   *
   * @return {Promise.bool}
   *   A promise returning boolean that is true if src is a valid csv path or directory.
   */
  validateSrc() {
    return new Promise((resolve, reject) => {
      const promises = [];
      // Add to promise array.
      promises.push(this.isDirectory(this.src));
      promises.push(this.isCsvFile(this.src));

      Promise.all(promises)
        .then((dir) => {
          // ensure that we have a true value between dir and file.
          if (!dir[0] && !dir[1]) {
            // If neither were true than we have neither a file or a directory.
            reject([`Source Path ${this.getSrc()} must be a csv file or directory of csv.`]);
          }
          else {
            // Set isDirectory.
            this.isDirectory = dir[0];
            resolve(true);
          }
        })
    })
  }

  /**
   * Sets the Paths Object.
   *
   * @param {object} paths
   *   An empty or filled object.
   */
  setPaths(paths) {
    this.paths = paths;
  }

  /**
   * getPaths()
   *   Returns this.paths.
   *
   * @returns {object} this.paths
   */
  getPaths() {
    return this.paths;
  }

  /**
   * addPath.
   *   Adds a json parsed csv file to the paths Object keyed by path.
   *
   * @param {string} pather
   *   A string path to a csv file.
   * @returns {Promise.bool}
   */
  addPath(pather) {
    return new Promise((res, rej) => {
      fs.readFile(pather, "utf-8", (err, data) => {
        if (err) {
          rej(err);
        }
        else {
          const options = {
            delimiter : ',', // optional
            quote     : '"' // optional
          };
          // Get the part of the path after the src path.
          // So that when we write to the dest directory we mirror the dir
          // structure of the src.


          if (pather !== this.getSrc()) {
            let resolvedPath = pather.split(path.resolve(this.getSrc()))[1];
            this.getPaths()[resolvedPath] = csvjson.toObject(data, options);
          }
          else {
            let resolvedPath = path.basename(pather);
            this.getPaths()[resolvedPath] = csvjson.toObject(data, options);
          }
          res(true);
        }
      })
    })
  }

  /**
   * collectPaths
   *   Returns an object bearing promise of json objects representing csv drummap files keyed by path from the src path.
   *
   *
   * @returns {Promise.Object} paths
   *   returns a Promise Object of json objects keyed to csv paths from src.
   */
  collectPaths() {
    const promises = [];
    return new Promise((res, rej) => {
      this.validateSrc()
      .then(()=> {
        if (!this.isDirectory) {
          // If we only have a file then, simply add the file path to the paths object.
          this.addPath(this.src).then(() => {
            res(this.getPaths());
          })
        }
        else {
          this.walkPaths()
          .then((paths) => {
            paths.forEach((item) => {
              promises.push(this.addPath(item));
            });
            Promise.all(promises)
            .then((values) => {
              res(this.getPaths());
            })
          })
        }
      })
    })
  }

  /**
   * walkPaths
   *   Walks a directory for csv paths.
   *
   * @returns {Promise.array}
   *  An Array bearing promise of paths.
   */
  walkPaths() {
    const paths = [];
    return new Promise((res, rej) => {
      klaw(this.getSrc())
        .on('readable', function () {
          var item
            while ((item = this.read())) {
              if (item.stats.isFile()) {
                if (path.extname(item.path) === '.csv') {
                  paths.push(item.path);
                }
              }
            }
        })
        .on('error', function (err, item) {
          rej(err);
        })
        .on('end', function () {
          res(paths);
        })
    });
  }

  /**
   * isDirectory
   *   Checks to see if the given path leads to a directory based on item stats.
   *
   * @param {string} srcPath
   *   A string representing a path.
   *
   * @returns {Promise.boolean}
   *   Returns a boolean promise on whether the path is a directory or not.
   */
  isDirectory(srcPath) {
    return new Promise((res, rej) => {
      fs.lstat(srcPath, (err, stats) => {
        if (err) {
          rej(err);
        }
        else {
          let testResult = false;
          if (stats.isDirectory()) {
            testResult = true;
          }
          res(testResult);
        }
      })
    });
  }

  /**
   * isCsvFile
   *   Checks to see if the given path leads to a csv file based on type and extension.
   *
   * @param {string} srcPath
   *   A string representing a path.
   *
   * @returns {Promise.boolean}
   *   Returns a boolean promise on whether the path is a file with csv extension.
   */
  isCsvFile(srcPath) {
    return new Promise((res, rej) => {
      fs.lstat(srcPath, (err, stats) => {
        if (err) {
          rej(err);
        }
        else {
          let testResult = false;
          if (stats.isFile()) {
            if (path.extname(srcPath) === '.csv') {
             testResult = true;
            }
          }
          res(testResult);
        }
      })
    });
  }
}