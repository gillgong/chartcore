module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs : grunt.file.readJSON('config.json')
  });

  grunt.registerTask('compressjs','compress js here',function() {

    console.log('begin compress js code');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.task.run('requirejs');
    console.log('end compress js code');

  });

  grunt.registerTask('default', ['compressjs']);
};