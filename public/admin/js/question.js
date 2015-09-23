(function($) {
    $(function() {

        var questTable = $('#questTable');
        var searchBar = $('.gm-search-bar');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.btn-delete', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);

            var isDel = confirm("是否要删除？");

            if (isDel) {
                $.ajax({
                    url: '/admin/api/question/' + target.data('qid'),
                    type: 'DELETE',
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    dataType: 'json',
                    success: function(res){
                        // console.log(res);
                        if(res.ret == 0){
                            target.parent().parent().fadeOut();
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 删除失败......');
                        }
                    }
                });
            }
        });

        searchBar.delegate('.gm-search', 'click', function(e){
            e.preventDefault();

            var qname = searchBar.find('.qname').val();

            if (qname != '') {
                location.href = '/admin/question/name/' + qname;
            } else {
                alert('(╯‵□′)╯︵┻━┻ 填个名字啊......');
            }
        });

    });
})($);
