(function($) {
    $(function() {

        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.btn-add', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var answers = questTable.find('.answers-area dt');

            if (answers.length < 10) {
                var newAnder = $('<dt><input class="form-control asr" type="text" name="answers" required="required" /></dt>');
                var answersArea = questTable.find('.answers-area');
                answersArea.append(newAnder);
            } else {
                alert('最多添加10个错误答案');
            }
        });

        questTable.delegate('.btn-submit', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);

            var qname = questTable.find('.qname').val();
            var qdesc = questTable.find('.qdesc').val();
            var mtype = questTable.find('.mtype');
            var videoUrl = questTable.find('.videoUrl').val();
            var correctAnswer = questTable.find('.correct').val();
            var answers = questTable.find('.asr');

            var vflag = true;

            if (qname == '' || qdesc == '' || videoUrl == '' || correctAnswer == '') {
                vflag = false;
            }

            var _mtypeChecked = 0;
            for (var i = 0; i < mtype.length; i++) {
                if (mtype[i].checked) {
                    _mtypeChecked = 0;
                    break;
                } else {
                    _mtypeChecked++;
                }
            }
            if (_mtypeChecked > 0) {
                vflag = false;
            }

            for (var j = 0; j < answers.length; j++) {
                if ($(answers[i]).val() == '') {
                    vflag = false;
                    break;
                }
            }

            if (vflag) {
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
                            window.location.href = '/admin/question';
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            } else {
                alert('(╯‵□′)╯︵┻━┻ 检查表单必填项！');
            }


        });

    });
})($);
