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
     lookingURL:apiDict[apiName] +'BillApply/GetApplyDtl',
     materialOptions:null    
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    // 物料类型数据
    axiosDict['basic'].get('TypeofMaterial/GetList?condition=[]&orderby=').then(res=>{
      console.log(res)   
      if(res) this.materialOptions = res
    })
    this.serch()
  },
  methods: {
      serch(){
        this.$refs.singleView.singleTableData.currentPage = 1
        this.looking()
      },
      looking(){
              let param ={
              condition:JSON.stringify(this.$refs.singleView.condition),
              page:JSON.stringify(this.$refs.singleView.singleTableData.currentPage),
              size:JSON.stringify(this.$refs.singleView.singleTableData.pageSize)
              };
              axiosDict[apiName].get(this.lookingURL,{
              params:param
              }).then(res=>{
                this.$refs.singleView.singleTableData.data = []
                if(res){
                  res.rows.map(item=>{this.$refs.singleView.singleTableData.data.push(item)})
                  this.$refs.singleView.singleTableData.total = res.total
                }
              })

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
      getCondition(arg,value,label,data){
       if(label == '物料大类' && data.find(p=>p.FieldName =='materialClass')){
        if(data.find(p=>p.FieldName =='materialClass').Value[0].value !== ''){
          if(this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.length !== 0){
            this.$refs.singleView.queryCondition.materialSubclass.options = this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.map(item=>{ return {value:item.name,label:item.name} })
            if(data.find(p=>p.FieldName =='materialClass').Value[0].value!== '' && !this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.some(item=>{ return item.name === this.$refs.singleView.queryCondition.materialSubclass.value})){
                    this.$refs.singleView.queryCondition.materialSubclass.value = ''
                    data.find(p=>p.FieldName =='materialSubclass').Value[0].value= ''
                  }
          }
          else
            this.$refs.singleView.queryCondition.materialSubclass.options =[]
        }else{
          this.$refs.singleView.queryCondition.materialSubclass.options = []
          this.$refs.singleView.queryCondition.materialSubclass.value = ''
          data.find(p=>p.FieldName =='materialSubclass').Value[0].value= ''
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