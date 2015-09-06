module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('compressjs','compress js here',function() {

    grunt.config.set('requirejs',{
      compile: {
        options: {
          baseUrl: "./public",
          fileExclusionRegExp: /jquery1.11.js$/,
          mainConfigFile: "public/config.js",
          name : 'example/serierschart/serierschartIns',
          //include: ["chartlib/axis/axis_x",'chartlib/chart/chart','chartlib/axis/axis_y'],
          out: "public/chart.min.js"
        }
      }      
    });
    if( !grunt.task.exists('requirejs') ) {
      grunt.loadNpmTasks('grunt-contrib-requirejs');
    }
    grunt.task.run('requirejs');
  });

  grunt.registerTask('default', ['compressjs']);
};