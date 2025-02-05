layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //计划项数据展示
    var  tableIns = table.render({
        elem: '#cusDevPlanList',
        url : ctx+'/cus_dev_plan/list?saleChanceId='+$("input[name='id']").val(),
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "cusDevPlanListTable",
        cols : [[
            {type: "checkbox", fixed:"center"},
            {field: "id", title:'编号',fixed:"true"},
            {field: 'planItem', title: '计划项',align:"center"},
            {field: 'planDate', title: '计划时间',align:"center"},
            {field: 'exeAffect', title: '执行效果',align:"center"},
            {field: 'createDate', title: '创建时间',align:"center"},
            {field: 'updateDate', title: '更新时间',align:"center"},
            {title: '操作',fixed:"right",align:"center", minWidth:150,templet:"#cusDevPlanListBar"}
        ]]
    });


    /**
     * 监听头部工具栏
     */
    table.on("toolbar(cusDevPlans)",function (obj) {
        switch (obj.event) {
            case "add" :
                openAddOrUpdateCusDevPlanDialog();
                break;
            case "success":
                updateSaleChanceDevResult($("input[name='id']").val(),2);
                break;
            case "failed":
                updateSaleChanceDevResult($("input[name='id']").val(),3);
                break;
        }
    });


    /**
     * 监听行工具栏
     */
    table.on("tool(cusDevPlans)",function (obj) {
        var layEvent = obj.event;
        if(layEvent === "edit"){//更新计划项
            openAddOrUpdateCusDevPlanDialog(obj.data.id);
        }else if(layEvent === "del"){//删除
            layer.confirm("确认删除当前记录?",{icon: 3, title: "客户开发计划管理"},function (index) {
                $.post(ctx+"/cus_dev_plan/delete",{id:obj.data.id},function (data) {
                    if(data.code==200){
                        layer.msg("删除成功",{icon:6});
                        //刷新数据表格
                        tableIns.reload();
                    }else{
                        layer.msg(data.msg,{icon:5});
                    }
                })
            })
        }
    });



    function openAddOrUpdateCusDevPlanDialog(id) {
        var title="计划项管理管理-添加计划项";
        var url=ctx+"/cus_dev_plan/toAddOrUpdateCusDevPlanPage?sId="+$("input[name='id']").val();
        if(id != null && id != ''){
            title="计划项管理管理-更新计划项";
            url=url+"&id="+id;
        }
        layui.layer.open({
            title:title,
            type:2,
            area:["500px","350px"],
            maxmin:true,
            content:url
        })
    }



    function updateSaleChanceDevResult(sid,devResult) {
        // 弹出确认框，询问用户是否确认删除
        layer.confirm("你确认更新机会数据状态?",{icon: 3, title: "营销机会管理"},function (index) {
            // 得到需要被更新的营销机会ID
            $.post(ctx+"/sale_chance/updateSaleChanceDevResult",{
                id:sid,
                devResult:devResult
            },function (data) {
                if(data.code==200){
                    layer.msg("机会数据更新成功",{icon:6});
                    layer.closeAll("iframe");
                    // 刷新父页面
                    parent.location.reload();
                }else{
                    layer.msg(data.msg,{icon:5});
                }
            })
        })
    }





});
