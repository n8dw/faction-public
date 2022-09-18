const { DateTime } = require("luxon");
const pluginSEO = require("eleventy-plugin-seo");

/**
* This is the JavaScript code that determines the config for your Eleventy site
*
* You can add lost of customization here to define how the site builds your content
* Try extending it to suit your needs
*/

module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2"
  ]);
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  let markdownIt = require('markdown-it');
  /* MarkdownIt Plugins */
  /*const markdownItEmoji = require("markdown-it-emoji");*/
  var markdownItAttrs = require('markdown-it-attrs');

  /* MarkdownIt General Options */
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  
  let markdownLib = markdownIt(options).use(markdownItAttrs);
  
  eleventyConfig.setLibrary("md", markdownLib);

  /* From: https://github.com/artstorm/eleventy-plugin-seo
  
  Adds SEO settings to the top of all pages
  The "glitch-default" bit allows someone to set the url in seo.json while
  still letting it have a proper glitch.me address via PROJECT_DOMAIN
  */
  const seo = require("./src/seo.json");
  if (seo.url === "glitch-default") {
    seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
  }
  eleventyConfig.addPlugin(pluginSEO, seo);

  // Filters let you modify the content https://www.11ty.dev/docs/filters/
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

  /* Build the collection of posts to list in the site
     - Read the Next Steps post to learn how to extend this
  */
  eleventyConfig.addCollection("posts", function(collection) {
    
    /* The posts collection includes all posts that list 'posts' in the front matter 'tags'
       - https://www.11ty.dev/docs/collections/
    */
    
    // EDIT HERE WITH THE CODE FROM THE NEXT STEPS PAGE TO REVERSE CHRONOLOGICAL ORDER
    // (inspired by https://github.com/11ty/eleventy/issues/898#issuecomment-581738415)
    const coll = collection
      .getFilteredByTag("posts");
      
    return coll;
  });

  eleventyConfig.addShortcode("FESTIFY_UNIQUE_ID", function(){
    let baseURL = process.env.FESTIFY_URL;
    let uniqueID = baseURL.substring(25);
    return uniqueID;
  });

  eleventyConfig.addShortcode("JOIN_LINK", function(){
    let quickAccessBase = "faction.party/"
    let glitchProjectName = process.env.PROJECT_DOMAIN;
    let joinLink = quickAccessBase + glitchProjectName;
    return joinLink;
  });

  var state = process.env.REQUESTS_TOGGLE;
  if (state == "on" || state == "ON" || state == "true" || state == true) {
    var stateBool = true;
  }
  else if (state == "off" || state == "OFF" || state == "false" || state == false) {
    var stateBool = false;
  }
  else {
    throw {name : "ENVIRONMENT ERROR", message : "REQUESTS_TOGGLE is incorrectly set. Check .env file."};
  }
  eleventyConfig.addNunjucksGlobal("requestToggleState", stateBool);

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: "src",
      includes: "_includes",
      output: "build"
    }
  };
};