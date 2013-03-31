({
    appDir: '../',
    baseUrl: 'scripts/',
    dir: '../../../production-build-test',
    paths: {
        'jquery': 'empty:'
    },

    modules: [
        //Optimize the application files. jQuery is not 
        //included since it is already in require-jquery.js
        {
            name: 'main'
        }
    ]
})
