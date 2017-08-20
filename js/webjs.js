$(document).ready(function () {
    var $item=$('.list-group-item');
    $item.click(function () {
        $item.removeClass('active');
        $(this).addClass('active');
        //alert($(this).attr('id'));
    });
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
                title: 'ID',
//            formatter:function(value, row, index){
//                return row.index=index+1 ; //返回行号
//            }//直接采用json数据中的ID
            }, {
                field: 'name',
                title: '企业名称',

            }, {
                field: 'address',
                title: '地址'
            },{
                field:'xxxxid',
                title:'数据操作',
                width:'20%',
                formatter:function (value,row,index) {
                    var str='<a href="#" class="btn btn-primary btn-sm" data-target="#xxxxmodal" data-toggle="modal">详细信息<li class="glyphicon glyphicon-list-alt"></li></a>'+
                        '<a href="#" class="btn btn-primary btn-sm" data-target="#deletemodal" data-toggle="modal">删除<li class="glyphicon glyphicon-remove"></li></a>';
                    return str;
                }
            }
        ]
    });

})