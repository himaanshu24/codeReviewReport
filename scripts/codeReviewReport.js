$(document).ready( function() {

    // Get the numbe of "TODO" in each file in a branch
    var getNumberOfToDos = function (username, repoName, branchName, fileName) {
        var todoRow = [];
        $('.c-data').empty();
        $('table').hide();
        $.ajax({
            url: 'https://raw.githubusercontent.com/' + username + '/' + repoName + '/' + branchName + '/' + fileName,
            head: 'Accept: application/api.github.VERSION.raw',
            success: function(results, xhr)
            {

                if( results.match(/TODO/g) !== null) {
                    // console.log('================================');
                   // console.log(branchName, ' --- ', fileName, ' TTT ', results.match(/TODO/g).length);
                    todoRow.push(
                            '<tr>' +
                                '<td>' + fileName + '</td>' +
                                '<td>' + (results.match(/HDC/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                                '<td>' + (results.match(/TODO/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                                '<td>' + (results.match(/CMS/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                                '<td>' + (results.match(/NMC/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                                '<td>' + (results.match(/TCF/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                                '<td>' + (results.match(/DCR/g) !== null ? results.match(/TODO/g).length : 0) + '</td>' +
                            '</tr>'
                    );
                    //console.log(results.substr(0, results.indexOf('TODO')).split("\n").length);
                    // console.log('*********************************');
                }
                //console.log($('.c-data')[0].innerHTML);
                $('.c-data').append(todoRow.join(''));
                $('table').show();

            }
        });
    };

    // Get all the files in a sprint
    var getAllTheFileFormAllBranch = function (username, repoName, gitSha, branchName) {
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
                             //console.log('Files = > ',  currentValue.path, branchName);
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
                if (results.data instanceof Array) {
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
                } else {
                    alert('Error');
                }

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
        var repoName = 'UI_Induction';
        $('.c-select-wrapper select').on('change', function() {
            var gitSha = $(this).find('option:selected').attr('data-sha');
            var branchName = $(this).val();
            // Checking if default option is  not selected since it give "gitSha"
            // undefined
            if (gitSha !== undefined) {
                getAllTheFileFormAllBranch(username, repoName, gitSha, branchName);
            }
            // console.log($(this).val(), $(this).find('option:selected').attr('data-sha'));
        });

        $('.c-fetch-git-info').on('click', function() {
            var username = $('#c-git-username').val();
            var repoName = $('#c-git-repo-name').val();
            getBranchsGithubRepository(username, repoName);
        });
    };


    var getListOfFilesInGithubRepository = function() {
        bindEventHandler();
    };


    getListOfFilesInGithubRepository();


});
