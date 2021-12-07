const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
var mila = require('markdown-it-link-attributes')
const pluginBetterSlug = require('@borisschapira/eleventy-plugin-better-slug')

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')
const iconsprite = require('./utils/iconsprite.js')
const pluginSrcsetImg = require('eleventy-plugin-srcset')

module.exports = function (config) {
    // Plugins
    config.addPlugin(pluginRss)
    config.addPlugin(pluginNavigation)
    config.addPlugin(pluginBetterSlug)

    config.addPlugin(pluginSrcsetImg, {
        srcsetWidths: [320, 540, 900, 1024],
        autoselector: '.post-content img',
        createCaptions: true
    })

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName])
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        config.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })

    // Icon Sprite
    config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

    // Asset Watch Targets
    config.addWatchTarget('./src/assets')

    // Markdown
    let markdownIt = require('markdown-it')
    let markdownItOptions = {
        html: true,
        breaks: true,
        linkify: true,
        typographer: true
    }
    let mila = require('markdown-it-link-attributes')
    let milaOptions = {
        pattern: /^(?!(https:\/\/kentcommunityhousinghub\.org|#)).*$/gm,
        attrs: {
            target: '_blank',
            rel: 'noopener noreferrer'
        }
    }
    let markdownLib = markdownIt(markdownItOptions).use(mila, milaOptions)
    config.setLibrary('md', markdownLib)

    // Layouts
    config.addLayoutAlias('base', 'base.njk')
    config.addLayoutAlias('post', 'post.njk')

    // Pass-through files
    config.addPassthroughCopy('src/robots.txt')
    config.addPassthroughCopy('src/site.webmanifest')
    config.addPassthroughCopy('src/assets/images')
    config.addPassthroughCopy('src/assets/fonts')
    config.addPassthroughCopy('src/assets/icons')
    config.addPassthroughCopy('src/uploads')
    config.addPassthroughCopy('src/admin')

    // Deep-Merge
    config.setDataDeepMerge(true)

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk', 'md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }
}
