$(document).ready( function() {


    // Get the numbe of "TODO" in each file in a branch
    var getNumberOfToDos = function(username, repoName, branchName, fileName) {
        $.ajax({
            url: 'https://raw.githubusercontent.com/' + username + '/' + repoName + '/' + branchName + '/' + fileName,
            head: 'Accept: application/api.github.VERSION.raw',
            success: function(results, xhr)
            {

                if( results.match(/TODO/g) !== null) {
                    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                    console.log(branchName, ' --- ',fileName, ' TTT ',results.match(/TODO/g));
                    //console.log(results.substr(0, results.indexOf('TODO')).split("\n").length);
                    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ');
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
                    if (currentValue.ref.indexOf('refs/heads') > -1) {
                        //console.log(currentValue);
                        gitSha = currentValue.object.sha;
                        // console.log(currentValue.ref);
                        branchName  = currentValue.ref.split('/').pop();
                        
                        getAllTheFileFormAllBranch(username, repoName, gitSha, branchName);
                        // getNumberOfToDos(username, repoName, branchName);
                    }
                });
            }
        });



    };



    var getListOfFilesInGithubRepository = function() {
        var username = 'himanshuk-optimus';
        var repoName = 'UI_Induction';
        getBranchsGithubRepository(username, repoName);
    };


    getListOfFilesInGithubRepository();


});
