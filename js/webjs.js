$(document).ready(function () {
    var $item=$('.list-group-item');
    $item.click(function () {
        $item.removeClass('active');
        $(this).addClass('active');
        //alert($(this).attr('id'));
    });

    var $rightcontent=$('#rightcontent > div');
    $rightcontent.each(function () {
        //alert($(this).attr('id'));
    });
    // $("a[id='wxpfl']").click(function () {
    //     $rightcontent.each(function () {
    //         $(this).att
    //     })
    // })
    // $('#tj').click(function () {
    //     $('#formxg').submit();
    // });
    //详细信息lable宽度；
    $('#xxxx tr td:even').css({"width":"15%"});
    $('#xxxx tr td:odd').css({"width":"35%"});
    $('#xiugaimodal tr td:even').css({"width":"15%"});
    $('#xiugaimodal tr td:odd').css({"width":"35%"});
    //模态框居中,该实现方式 弹出框是居中了， 但弹出时有一些迟疑后抖动到中部；不是特别理想
    $('#xxxxmodal,#xiugaimodal').on('shown.bs.modal',function () {
        var $this = $(this);
        var $modal_dialog = $this.find('.modal-dialog');
        var m_top = ( $(window).height() - $modal_dialog.height() )/2;
        $modal_dialog.css({'margin': m_top + 'px auto'});
    });
    //修改信息
    // $('#xiugaimodal').on('show.bs.modal',function () {
    //     $('#xgp').text('dad');
    // })
    //加载table数据
    $('#table').bootstrapTable({
        url:'data/tablejson.json',
        method: 'get',
        //url:"./index.php?r=subprocess/subprocessInfo",
        editable:true,//开启编辑模式
        clickToSelect: true,
        cache: false,//设置为 false 禁用 AJAX 数据缓存
        showToggle:true, //显示切换按钮来切换表/卡片视图。
        showPaginationSwitch:false, //显示分页切换按钮
        pagination: true,
        pageList: [15,30,50,100],
        pageSize:15,
        pageNumber:1, //设置分页的首页页码
        uniqueId: 'indexid', //将index列设为唯一索引
        striped: true,//隔行变色
        search: true,//是否启用搜索框
        //searchText:'搜索',//搜索提示文字
        showRefresh: true,//是否显示 刷新按钮
        showColumns:true,//是否显示 内容列下拉框,选择显示的列
        minimumCountColumns: 2,//当列数小于此值时，将隐藏内容列下拉框。

        smartDisplay:true,
        columns:[
//            {
//            width:'50px',
//            formatter:function (value,row,index) {
//                var str='<input type="checkbox">';
//                return str;
//            }
//        },
            {
                field: 'id',
                title: 'ID'
//            formatter:function(value, row, index){
//                return row.index=index+1 ; //返回行号
//            }//直接采用json数据中的ID
            }, {
                field: 'name',
                title: '企业名称'

            }, {
                field: 'address',
                title: '地址'
            },{
                field:'xxxxid',
                title:'数据操作',
                width:'25%',
                formatter:function (value,row,index) {
                    var str='<a href="#" class="btn btn-primary btn-sm" data-target="#xxxxmodal" data-toggle="modal">详细信息<li class="glyphicon glyphicon-list-alt"></li></a>'+
                        '<a href="#" class="btn btn-primary btn-sm" data-target="#deletemodal" data-toggle="modal">删除<li class="glyphicon glyphicon-remove"></li></a>'+
                        '<a href="#" id="xxxg" class="btn btn-primary btn-sm" data-target="#xiugaimodal" data-toggle="modal">修改<li class="glyphicon glyphicon-pencil"></li></a>';
                    return str;
                }
            }
        ]
    });

});