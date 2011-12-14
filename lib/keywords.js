
/*!
 * Copyright(c) Beau Sorensen
 * MIT Licensed
 */

/**
 * Extract Keywords
 *
 * Examples:
 *  
 *    var options = {
 *      target: 'keywords',
 *      source: 'abc xyz something',
 *      minLength: 4
 *    }
 *    mongoose.plugin(keywords,options)
 *
 * @param {Object} mongoose instance variable or mongoose schema
 * @param {Object} options
 *
 * Options:
 *
 *  - `target` default: 'keywords'
 *  - `source` 
 *  - `minLength` default: 2
 *  
 */ 

module.exports = function(schema, options) {
  options || (options = {})

  var target = (options.target || 'keywords')
    , source = options.source
    , minLength = (options.minLength || 2)
    , fields = {}

  if (!schema.paths[target]) {
    fields[target] = [String]
    schema.add(fields)
  }

  schema
    .pre('save', function(next) {
      var words = []
      if (!(source instanceof Array)) source = [source]
      for (var i = 0; i < source.length; i++) {
        var add = this.extractKeywords(this[source[i]])
        for (var s = 0; s < add.length; s++) {
          if (!~words.indexOf(add[s])) words.push(add[s])
        }
      }
      this[target] = words
      next()
    })
  
  /*
   *
   * Note: filter() method return the elements of an array that meet the condition specified in the callback
   * filter(value)
   * filter(value,index,array)
   */
  schema
    .method('extractKeywords', function (str) {
      if (!str) return []
      return str
        .toLowerCase()
        .split(/\s+/)// \s whitespace character + means atleast one
        .filter(function(v) { return v.length > minLength })// Return the element whose length is gt than minLength
        .filter(function(v, i, a) { return a.lastIndexOf(v) === i })// Remove any duplicates..
    })
}
