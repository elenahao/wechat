/**
 * Created by elenahao on 15/9/8.
 */

(function($) {
    $(function() {
        var questTable = $('#questTable');
        var searchBar = $('.gm-search-bar');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.gm-add', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var dialog = art.dialog({
                title: '新增组',
                content: '<label>组名称：</label><input id="group_name" value=""/>',
                ok: function(){
                    var group_name = $('#group_name').val();
                    if(group_name == '') {
                        alert('(╯‵□′)╯︵┻━┻ 检查组名称必填项！');
                        return false;
                    }else{
                        console.log('ddd'+group_name);
                        console.log('sss'+questTable.find('#gname'));
                        questTable.find('#gname').val(group_name);
                        $.ajax({
                            url: questTable.attr('action'),
                            headers: {
                                'X-CSRF-Token': csrfKey
                            },
                            data: questTable.serialize(),
                            method: 'POST',
                            dataType: 'json',
                            success: function(res) {
                                if (res.ret == 0) {
                                    window.location.href = '/admin/group';
                                } else {
                                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                                }
                            }
                        });
                    }

                },okVal: '确定',
                cancelVal: '关闭',
                cancel: function(){
                    console.log('关闭');
                },fixed:true,
                resize:true
            });
        });

        questTable.delegate('.btn-edit', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var groupid = $(this).attr("groupid");
            var groupname = $(this).attr("groupname");
            var dialog = art.dialog({
                title: '编辑组',
                content: '<label>组名称：</label><input id="group_name" value='+groupname+'>',
                ok: function(){
                    var group_name = $('#group_name').val();
                    if(group_name == '') {
                        alert('(╯‵□′)╯︵┻━┻ 检查组名称必填项！');
                        return false;
                    }else{
                        console.log('ddd'+group_name);
                        console.log('sss'+questTable.find('#gname'));
                        questTable.find('#gname').val(group_name);
                        questTable.find('#gid').val(groupid);
                        questTable.attr('action', '/admin/api/group/edit');
                        $.ajax({
                            url: questTable.attr('action'),
                            headers: {
                                'X-CSRF-Token': csrfKey
                            },
                            data: questTable.serialize(),
                            method: 'POST',
                            dataType: 'json',
                            success: function(res) {
                                if (res.ret == 0) {
                                    window.location.href = '/admin/group';
                                } else {
                                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                                }
                            }
                        });
                    }
                },okVal: '确定',
                cancelVal: '关闭',
                cancel: function(){
                    console.log('关闭');
                },fixed:true,
                resize:true
            });
        });

        questTable.delegate('.btn-delete', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);

            var gname = $(this).attr('groupname');
            var gid = $(this).attr('groupid');
            var isDel = confirm("是否要删除"+gname+"？");

            if (isDel) {
                $.ajax({
                    url: '/admin/api/group/delete/' + gid,
                    type: 'GET',
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    dataType: 'json',
                    success: function(res){
                        if(res.ret == 0){
                            target.parent().parent().fadeOut();
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 删除失败......');
                        }
                    }
                });
            }
        });

        //add at 2015-09-15
        questTable.delegate('.btn-warning', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var groupid = $(this).attr("groupid");
            //var groupnickname = $(this).attr("groupnickname") == undefined ? '' : $(this).attr("groupnickname");
            var dialog = art.dialog({
                title: '自动添加用户',
                width: 800,
                content: document.getElementById('x_div'),
                ok: function(){
                    var group_nickname = $('#group_nickname').val();
                    if(group_nickname == '') {
                        alert('(╯‵□′)╯︵┻━┻ 检查别名为必填项！');
                        return false;
                    }else{
                        console.log('ddd'+group_nickname);
                        console.log('sss'+questTable.find('#gnickname'));
                        questTable.find('#gnickname').val(group_nickname);
                        questTable.find('#gid').val(groupid);
                        questTable.attr('action', '/admin/api/group/addQuarz');
                        $.ajax({
                            url: questTable.attr('action'),
                            headers: {
                                'X-CSRF-Token': csrfKey
                            },
                            data: questTable.serialize(),
                            method: 'POST',
                            dataType: 'json',
                            success: function(res) {
                                if (res.ret == 0) {
                                    window.location.href = '/admin/group';
                                } else {
                                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                                }
                            }
                        });
                    }

                },okVal: '确定',
                cancelVal: '关闭',
                cancel: function(){
                    console.log('关闭');
                },fixed:true,
                resize:true
            });
        });

        searchBar.delegate('.gm-search', 'click', function(e){
            e.preventDefault();

            var gname = searchBar.find('.gname').val();

            if (gname != '') {
                location.href = '/admin/group/name/' + gname;
            } else {
                alert('(╯‵□′)╯︵┻━┻ 填个名字啊......');
            }
        });

    });
})($);

