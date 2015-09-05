module.exports = function(grunt) {

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    requirejs: {
      compile: {
        options: {
          baseUrl: "./public",
          fileExclusionRegExp: /(jquery1.11|require|underscore|text)$/,
          mainConfigFile: "public/config.js",
          include: ["chartlib/axis/axis_x",'chartlib/chart/chart','chartlib/axis/axis_y'],
          out: "public/chartlib/chart.min.js"
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['requirejs']);
};