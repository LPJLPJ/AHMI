/**
 * Created by ChangeCheng on 2016/11/11.
 */
$(function () {
    var curUsers = [];
    var tempUsers = [];
    console.log('curUsers', curUsers)
    function getUsers() {
        var getUserUrl = '/admin/manage/users'
        $.ajax({
            type: 'GET',
            url: getUserUrl,
            success: function (data, status, xhr) {
                //update success
                console.log('success', JSON.parse(data))
                curUsers = JSON.parse(data);
                tempUsers = curUsers.filter(function () {
                    return true;
                })
                insertUserViews(tempUsers.map(function (user) {
                    return renderUserToView(user)
                }))

            },
            error: function (err, status, xhr) {
                //update error
                console.log('err', err)
            }
        })
    }


    function renderUserToView(user) {
        var html = new EJS({url: '../../public/login/assets/views/userPanel.ejs'}).render({user: user});
        // console.log(html,typeof html)
        return html;
    }

    function insertUserViews(userViews) {
        var userUL = $(".users");
        userUL[0].innerHTML = "";
        userUL = $(userUL[0]);

        for (var i = 0; i < userViews.length; i++) {
            // userUL.innerHTML += userViews[i];
            userUL.append(userViews[i])
        }
    }

    function addSearchFunction() {
        var searchInput = $('#search-input');
        var searchBtn = $('#search-btn');
        searchBtn.on('click', function (e) {
            handleSearch();
        })

        searchInput.on('keypress', function (e) {
            if (e.keyCode === 13) {
                // console.log('press enter')
                handleSearch();
            }
        })
    }

    function handleSearch() {
        var searchInput = $('#search-input');
        var searchStr = searchInput.val().trim();
        console.log(searchStr)
        tempUsers = curUsers.filter(function (user) {
            return match(user.accountName, searchStr) || match(user.email, searchStr) || match(user.type, searchStr);
        })
        insertUserViews(tempUsers.map(function (user) {
            return renderUserToView(user)
        }))
    }

    function match(str, keyword) {
        if (!str) {
            return false;
        } else {
            return String(str).indexOf(keyword) !== -1;
        }

    }


    function addChanegTypeFunction() {
        var userUL = $($(".users")[0]);
        userUL.on('change','.user-panel',function (e) {
            var userId = e.currentTarget.dataset.userid;
            var newValue = e.target.value;
            changeTypeById(userId,newValue,$(e.currentTarget));
        })
    }

    function changeTypeById(userId,type,userPanelView) {
        var curTempUser;
        for (var i=0;i<tempUsers.length;i++){
            // console.log(tempUsers[i])

            if (tempUsers[i]._id == userId){
                //hit
                curTempUser = tempUsers[i];
                break;
            }
        }
        if (curTempUser){
            $.ajax({
                type:'POST',
                url:'/admin/manage/changeusertype',
                data:{
                    userId:userId,
                    type:type
                },
                success:function (data,status,xhr) {
                    curTempUser.type = type;
                    userPanelView.replaceWith(renderUserToView(curTempUser));
                },
                error:function (err,status,xhr) {
                    userPanelView.replaceWith(renderUserToView(curTempUser));
                }
            })
        }

    }

    addSearchFunction()
    addChanegTypeFunction();

    getUsers();


});