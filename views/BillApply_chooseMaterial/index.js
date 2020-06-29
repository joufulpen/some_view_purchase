function postSelection(args, source) {
      console.log(5,'postSelection',args,source)
      let data = {
        data:vm.HASCHOOSEDATA,
        closeDialog:true
      }
      source.postMessage({ method: 'passSelection', args: { data: data, to: args.to } }, '*')
    }

function alertData(args) {
  // console.log(6,'alertData',args)
  // Vue.prototype.$alert(JSON.stringify(args))
}
window.formatterMethods = {
    isActive:function(arg){
    if (arg.active == true) {
        return arg.active.value = '是'
    }
    if (arg.active == false) {
      return arg.active.value = '否'
    }
  }
 }
var resourceName = ''//资源名称 模板生成
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
     },
     HASCHOOSEDATA:null,
     lookingURL:undefined,
     Hdrcolumns: [{
        label: '序号',
        prop: 'index',
        fixed: 'fixed',
        width: '50px'
      },
      {
        prop: 'customerOrderNo',
        label: '客户订单编号',
        width: '160',
        fixed: 'fixed'
      },
      {
        prop: 'orderCode',
        label: '内部订单编号',
        width: '160'
      },
      {
        prop: 'projectName',
        label: '项目名称'
      },
      {
        prop: 'engCode',
        label: '工程代号'
      },
      {
        prop: 'customerName',
        label: '客户名称'
      },
      {
        prop: 'buildingName',
        label: '建筑名称'
      },
      {
        prop: 'amount',
        label: '金额',
        formatter(arg) {
          if (arg.amount != null) {
            return arg.amount.toFixed(2)
          }
        }
      },
      {
        prop: 'deliveryDate',
        label: '预计发货日期',
        formatter(arg) {
          if (arg.deliveryDate) {
            return dayjs(arg.deliveryDate).format("YYYY-MM-DD")
          }
        }
      },
      {
        prop: 'type',
        label: '订单类型'
      },
      {
        prop: 'status',
        label: '订单状态'
      },
      {
        prop: 'createDate',
        label: '创建日期',
        formatter(arg) {
          if (arg.createDate) {
            return dayjs(arg.createDate).format("YYYY-MM-DD")
          }
        }
      },
      {
        prop: 'createName',
        label: '创建人'
      }
    ],      
     materialOptions:null
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    if(window.location.hash.split('#')[4] == 'apply'){
          // 物料类型数据
        axiosDict['basic'].get('TypeofMaterial/GetList?condition=[]&orderby=').then(res=>{
          console.log(res)   
          if(res) this.materialOptions = res
        })
      this.lookingURL = apiDict[apiName] +'Goods_Pur/GetPageList'
    }
    else if(window.location.hash.split('#')[4] == 'chooseOrder'){
      this.lookingURL = apiDict['sale'] +'Order/GetHdrPageList'
      this.$refs.singleView.singleTableData.columns = this.Hdrcolumns
      this.$refs.singleView.queryCondition = {}
    }    
    this.serch()
  },
  methods: {
      serch(){
        this.$refs.singleView.singleTableData.currentPage = 1
        this.looking()
      },
      looking(){
        if(window.location.hash.split('#')[4] == 'chooseOrder'){
          let param = {
            condition:JSON.stringify([{"FieldName":"status","TableName":"[Hdr]","Value":[{"value":"拆单审核"},{"value":"计划待排"},{"value":"生产中"},{"value":"进仓"},{"value":"生产完成"},{"value":"发货"},{"value":"订单完成"}],"TableRelationMode":"AND","Mode":"相似","DataType":"string"}]),
            page: JSON.stringify(this.$refs.singleView.singleTableData.currentPage),
            size: JSON.stringify(this.$refs.singleView.singleTableData.pageSize)
          }
          axiosDict['sale'].get(this.lookingURL,{params:param}).then(res=>{
            console.log(res)
            this.$refs.singleView.singleTableData.data = []
            if(res.rows){
              res.rows.map(item=>{this.$refs.singleView.singleTableData.data.push(item)})
              this.$refs.singleView.singleTableData.total = res.total
            }
          })
        }else{
          if(window.location.hash.split('#')[4] == 'apply'){
              let param ={
                condition:JSON.stringify(this.$refs.singleView.condition),
                page:JSON.stringify(this.$refs.singleView.singleTableData.currentPage),
                size:JSON.stringify(this.$refs.singleView.singleTableData.pageSize)
                };
                axiosDict[apiName].get(this.lookingURL,{
                params:param
                }).then(res=>{
                  this.$refs.singleView.singleTableData.data = []
                  if(res.rows){
                    res.rows.map(item=>{this.$refs.singleView.singleTableData.data.push(item)})
                    this.$refs.singleView.singleTableData.total = res.total
                  }
                })
            }  
        } 
      },
      //cool-single-view 
      tableRowClick(arg){
        
      },
      tableRowDblclick(arg){
        
      },
      tableSelectionChange(arg){
        this.HASCHOOSEDATA = arg
      },  
      paginationSizeChange(arg){
        this.$refs.singleView.singleTableData.currentPage = 1
        this.$refs.singleView.singleTableData.pageSize = arg
        this.looking()
      },
      paginationCurrentChange(arg){
         this.$refs.singleView.singleTableData.currentPage = arg
         this.looking()
      },
      getCondition(arg,value,label){
        if(label == '物料大类' ){
        console.log(arg,label,this.materialOptions,arg.find(p=>p.FieldName =='materialClass').Value[0].value)
        if(arg.find(p=>p.FieldName =='materialClass').Value[0].value !== ''){
          if(this.materialOptions.find(p=>p.name == arg.find(p=>p.FieldName =='materialClass').Value[0].value).children.length !== 0)
            this.$refs.singleView.queryCondition.materialSubclass.options = this.materialOptions.find(p=>p.name == arg.find(p=>p.FieldName =='materialClass').Value[0].value).children.map(item=>{ return {value:item.name,label:item.name} })
          else
            this.$refs.singleView.queryCondition.materialSubclass.options =[]
        }else{
          this.$refs.singleView.queryCondition.materialSubclass.options = []
          this.$refs.singleView.queryCondition.materialSubclass.value = ''
        } 
       }
      },
      // cool-single-dialog
      updateForm(arg){

      },
      saveEvent(arg){

      }
  }
})