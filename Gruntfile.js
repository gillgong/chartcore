module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('compressjs','compress js here',function() {

    grunt.config.set('requirejs',{
      compile: {
        options: {
          optimize: "none",
          baseUrl: "./publicts",
          shim : {
            underscore: {
                exports: '_'
            },
            jquery: {
              exports: '$'
            }
          },
          paths: {
            underscore : '3rdlib/underscore',
            jquery : '3rdlib/jquery1.11',
            text : '3rdlib/text',
            axis : 'chartlib/axis/axis',
            axis_x : 'chartlib/axis/axis_x',
            axis_y : 'chartlib/axis/axis_y',
            chart : 'chartlib/chart/chart',
            ////////////////////////////////////////////////////////////////
            serierschart : 'example/serierschart/serierschart'
          },
          //mainConfigFile: "publicts/config.js",
          //name : 'example/serierschart/serierschartIns',
          out: "publicts/chart.min.js",
          exclude : [
            'jquery'
          ],
          include : [
          //  'underscore',
          //  'jquery',
          //  'text',
          //  'axis',
            'serierschart',
            'axis_x',
            'axis_y',
            'chart',
          ]
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