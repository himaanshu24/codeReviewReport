$(document).ready( function() {

    // Get the numbe of "TODO" in each file in a branch
    var getNumberOfToDos = function(username, repoName, branchName, fileName) {
        $.ajax({
            url: 'https://raw.githubusercontent.com/' + username + '/' + repoName + '/' + branchName + '/' + fileName,
            head: 'Accept: application/api.github.VERSION.raw',
            success: function(results, xhr)
            {

                if( results.match(/TODO/g) !== null) {
                    // console.log('================================');
                    console.log(branchName, ' --- ',fileName, ' TTT ',results.match(/TODO/g));
                    //console.log(results.substr(0, results.indexOf('TODO')).split("\n").length);
                    // console.log('*********************************');
                }

            }
        });
    };

    // Get all the files in a sprint
    var getAllTheFileFormAllBranch = function(username, repoName, gitSha, branchName) {
        var fileName;
        $.ajax({
            url: 'https://api.github.com/repos/'+username+'/'+repoName+'/git/trees/'+gitSha+'?recursive=1',
            head: 'Accept: application/api.github.VERSION.raw',
            success: function(results, xhr)
            {

                results.tree.map( function(currentValue) {
                    if(currentValue.type === 'blob') {
                        if ((/(css|js|dust|scss|htm|html)/gi).test(currentValue.path.split('.').pop())) {
                            fileName = currentValue.path;
                            // console.log('Files = > ',  currentValue.path, branchName);
                            getNumberOfToDos(username, repoName, branchName, fileName);
                        }

                    }
                });

            }
        });
    };


    var getBranchsGithubRepository = function(username, repoName) {
        var headBranch = [];
        var tagBranch = [];
        var pullBranch = [];
        $.ajax({
            url: 'https://api.github.com/repos/' + username + '/' + repoName + '/git/refs',
            dataType: 'jsonp',
            success: function(results, xhr)
            {
                var content = results.data.content;
                var branchName;
                var $options = [];
                var $table = [];
                var gitSha;
                // console.log(results.data instanceof Array);
                // console.log(results.data);

                results.data.map( function(currentValue) {
                    // console.log(currentValue.ref);
                    if (currentValue.ref.indexOf('refs/heads') > -1) {
                        gitSha = currentValue.object.sha;
                        branchName  = currentValue.ref.split('/').pop();
                        headBranch.push([branchName,gitSha]);
                    } else if (currentValue.ref.indexOf('refs/tags') > -1) {
                        gitSha = currentValue.object.sha;
                        branchName  = currentValue.ref.split('/').pop();
                        tagBranch.push([branchName,gitSha]);
                    } else if (currentValue.ref.indexOf('refs/pull') > -1) {
                        gitSha = currentValue.object.sha;
                        branchName  = currentValue.ref.split('/').pop();
                        pullBranch.push([branchName,gitSha]);
                    }
                });
                // getAllTheFileFormAllBranch(username, repoName, gitSha, branchName);

                // Seting the default options in selectbox.
                var optionsHead = ['<option>--Select Branch--</option>'];
                var optionsTag = ['<option>--Select Tag--</option>'];
                var optionsPull = ['<option>--Select PR--</option>'];
                // Creating the Branch selectbox options.
                headBranch.map( function(currentValue, index) {
                    optionsHead.push('<option data-sha="' + currentValue[1] + '">' + currentValue[0] + '</option>');
                });
                // Creating the Tag selectbox options.
                tagBranch.map( function(currentValue, index) {
                    optionsTag.push('<option data-sha="' + currentValue[1] + '">' + currentValue[0] + '</option>');
                });
                // Creating the branch selectbox options.
                pullBranch.map( function(currentValue, index) {
                    optionsPull.push('<option data-sha="' + currentValue[1] + '">' + currentValue[0] + '</option>');
                });

                // Populating the Branch, Tag and PR selectbox.
                $('.c-gitSelect-head')[0].innerHTML = optionsHead.join('');
                $('.c-gitSelect-tag')[0].innerHTML = optionsTag.join('');
                $('.c-gitSelect-pull')[0].innerHTML = optionsPull.join('');

            }
        });



    };

    var bindEventHandler = function() {
        var username = 'himanshuk-optimus';
        var repoName = 'my-first-github';
        $('.c-select-wrapper select').on('change', function() {
            var gitSha = $(this).find('option:selected').attr('data-sha');
            var branchName = $(this).val();
            getAllTheFileFormAllBranch(username, repoName, gitSha, branchName);
            // console.log($(this).val(), $(this).find('option:selected').attr('data-sha'));
        });
    };


    var getListOfFilesInGithubRepository = function() {
        var username = 'himanshuk-optimus';
        var repoName = 'my-first-github';
        getBranchsGithubRepository(username, repoName);
        bindEventHandler();
    };


    getListOfFilesInGithubRepository();


});
