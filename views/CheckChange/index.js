var resourceName = 'DetailBridge'//资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
     uniqueDeployKey:{
      api: apiDict[apiName] + resourceName
     },
     // axiosSetting 固定格式 需模板生成生成
     axiosSetting:{
        baseURL:apiDict[apiName],
      },
      // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
     isMethods:{
      isGetCondition:false,
      isTableSelectionChange:false,
      isPaginationSizeChange:true,
      isPaginationCurrentChange:true
     },
     showModeList:true,

      // 弹出框 固定格式 里面的值可按以下定义 需模板生成
     dialogs: [{
          top: '5vh',
          name: 'dialog',
          visible: false,
          collapse: false,
          width: '90%',
          title: '',
          src: '',
        }
      ],

     //cool-single-dialog
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     }

  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    this.searchData()
  },
  methods: {
      searchData(){
        let condition = JSON.parse(JSON.stringify(this.$refs.singleView.condition))
        condition.push({"FieldName":"code","TableName":"[InfoTable]","Value":[{"value":window.location.hash.split('#')[2]}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"},
          {"FieldName":"sourceTableName","TableName":"[InfoTable]","Value":[{"value":"StoreOutDtl"},{"value":"StoreInDtl"},{"value":"InventoryProfitDtl"},{"value":"InventoryLossDtl"}],"TableRelationMode":"AND","Mode":"包括","DataType":"string"},
          {"FieldName":"whid","TableName":"[InfoTable]","Value":[{"value":window.location.hash.split('#')[3]}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"})
        let param ={
          condition:JSON.stringify(condition),
          page: JSON.stringify(this.$refs.singleView.singleTableData.currentPage),
          size: JSON.stringify(this.$refs.singleView.singleTableData.pageSize)
        }
        axiosDict[apiName].get(`DetailBridge/GetStockRecord`,{params:param}).then(res=>{
          console.log(res)
          this.$refs.singleView.singleTableData.data = []
          res.rows.forEach(p=>{this.$refs.singleView.singleTableData.data.push(p)})
          this.$refs.singleView.singleTableData.total = res.total
        })
      },
      //cool-single-view
      tableRowClick(arg){

      },
      tableRowDblclick(arg){

      },
      tableSelectionChange(arg){

      },
      paginationSizeChange(arg) {
        this.$refs.singleView.singleTableData.currentPage = 1
        this.$refs.singleView.singleTableData.pageSize = arg
        this.searchData()
      },
      paginationCurrentChange(arg) {
        this.$refs.singleView.singleTableData.currentPage = arg
        this.searchData()
      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg){

      },
      saveEvent(arg){

      }
  }
})
