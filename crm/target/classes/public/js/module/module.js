layui.use(['table', 'treetable'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var treeTable = layui.treetable;
    treeTable.render({
        treeColIndex: 1,
        treeSpid: -1,
        treeIdName: 'id',
        treePidName: 'parentId',
        elem: '#menu-table',
        url: ctx+'/module/list',
        toolbar: "#toolbarDemo",
        treeDefaultClose:true,
        page: true,
        cols: [[
            {type: 'numbers'},
            {field: 'moduleName', minWidth: 100, title: '菜单名称'},
            {field: 'optValue', title: '权限码'},
            {field: 'url', title: '菜单url'},
            {field: 'createDate', title: '创建时间'},
            {field: 'updateDate', title: '更新时间'},
            {
                field: 'grade', width: 80, align: 'center', templet: function (d) {
                    if (d.grade == 0) {
                        return '<span class="layui-badge layui-bg-blue">⽬录</span>';
                    }
                    if(d.grade==1){
                        return '<span class="layui-badge-rim">菜单</span>';
                    }
                    if (d.grade == 2) {
                        return '<span class="layui-badge layui-bg-gray">按钮</span>';
                    }
                }, title: '类型'
            },
            {templet: '#auth-state', width: 180, align: 'center', title: '操作'}
        ]],
        done: function () {
            layer.closeAll('loading');
        }
    });
    //监听头部⼯具条
    table.on('toolbar(menu-table)', function(obj){
        switch(obj.event){
            case "expand":
                treeTable.expandAll('#menu-table');
                break;
            case "fold":
                treeTable.foldAll('#menu-table');
                break;
        };
    });
    //监听行工具栏
    table.on('tool(menu-table)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'add') {
            if(data.grade==2){
                layer.msg("暂不⽀持四级菜单添加操作!");
                return;
            }
            openAddModuleDialog(data.grade+1,data.id);
        } else if (layEvent === 'edit') {
            // 记录修改
            openUpdateModuleDialog(data.id);
        }else if (layEvent === 'del') {
            layer.confirm('确定删除当前菜单？', {icon: 3, title: "菜单管理"}, function (index) {
                $.post(ctx+"/module/delete",{id:data.id},function (data) {
                    if(data.code==200){
                        layer.msg("删除成功！",{time:1000});
                        window.location.reload();
                    }else{
                        layer.msg(data.msg, {icon: 5});
                    }
                });
            })
        }
    });

    table.on('toolbar(menu-table)', function(obj){
        switch(obj.event){
            case "expand":
                treeTable.expandAll('#menu-table');
                break;
            case "fold":
                treeTable.foldAll('#menu-table');
                break;
            case "add":
                openAddModuleDialog(0,-1);
                break;
        };
    });
// 打开添加资源的对话框
    function openAddModuleDialog(grade,parentId){
        var grade=grade;
        var url = ctx+"/module/addModulePage?grade="+grade+"&parentId="+parentId;
        var title="资源管理-添加资源";
        layui.layer.open({
            title : title,
            type : 2,
            area:["700px","450px"],
            maxmin:true,
            content : url
        });
    }
    function openUpdateModuleDialog(id){
        var url = ctx+"/module/toUpdateModulePage?id="+id;
        var title="菜单更新";
        layui.layer.open({
            title : title,
            type : 2,
            area:["700px","450px"],
            maxmin:true,
            content : url
        });
    }


});