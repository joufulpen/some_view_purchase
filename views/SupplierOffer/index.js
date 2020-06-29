
var resourceName = 'Supplier_Quotation'//资源名称 模板生成
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
      isPaginationCurrentChange:true,
      isTableRowClick:true
     },
      // 弹出框 固定格式 里面的值可按以下定义 需模板生成
     dialogs: [{
          top: '5vh',
          name: 'dialog',
          visible: false,
          collapse: false,
          width: '90%',
          title: '',
          src: ''
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
     materialTableData:[],
     supplierTableData:[],
     orderFormItems:null,
     editDialogTitle:'供应商报价管理',
     dialogWidth:'1100px',
     editDialogWidth:'400px',
     showSaveButton:true,
     supplierURL: apiDict[apiName] + 'Supplier/GetList?condition=[]',
     saveURL: apiDict[apiName] + 'Supplier_Quotation',
     labelWidth:'115px',
     inColumns:[
        {
          "prop": "supplierName",
          "label": "供应商名称"
        }
        ,{
          "prop": "price",
          "label": "报价",
          "formatter": function(arg) {
            return arg.price = Number(arg.price).toFixed(2)
          }
        }
        ,

        {
          "prop": "remark",
          "label": "备注"
        }
        ,
        {
          "prop": "createName",
          "label": "填报人",
          // "formatter": function(arg) {
          //   if (arg.createBy === '0000000000') {
          //     return arg.createBy.value = '100'
          //   }
          //   if (arg.createBy === true) {
          //     return arg.createBy.value = '启用'
          //   }else return arg.createBy
          // }
        },
        {
          "prop": "createDate",
          "label": "填报时间"
        },
        {
          "prop": "active",
          "label": "状态",
          "formatter": function(arg) {
            if (arg.active === false) {
              return arg.active.value = '禁用'
            }
            if (arg.active === true) {
              return arg.active.value = '启用'
            }
          }
        }],
     columns:[
        {
          "prop": "id",
          "label": "物料编码",
          "width":"130px"
        }
        ,
        {
          "prop": "name",
          "label": "名称"
        }
        ,
        {
          "prop": "materialClass",
          "label": "物料大类"
        }
        ,
        {
          "prop": "materialSubclass",
          "label": "物料小类"
        }
        ,
        {
          "prop": "enName",
          "label": "英文名"
        }
        ,
        {
          "prop": "byname",
          "label": "别名"
        }
        ,
        {
          "prop": "specifications",
          "label": "规格"
        }
        ,
        {
          "prop": "brandModel",
          "label": "品牌型号"
        }
        ,
        {
          "prop": "pigment",
          "label": "颜色"
        }
        ,
        {
          "prop": "unit",
          "label": "单位"
        }
        ,
        {
          "prop": "description",
          "label": "备注"
        }
        ],
        buttons:[{
        text: "新增",
        size: "mini",
        icon: "#iconxinzeng",
        disabled: false,
        type:"success"
      },{
        text: "删除",
        size: "mini",
        icon: "#iconERP_shanchu",
        disabled: true,
        type:"danger"
      },
      {
        text: "编辑",
        size: "mini",
        icon: "#iconERP_bianji",
        disabled: true,
        type:"primary"
      }
      ],
      editDialogFormItems:{
        "form":[{
          "type": "inputNumber",
            "value": "",
            "min":0,
            "label": "报价",
            "name": "price",
            "style": {
              "width": "100%"
            },
            "inputStyle":{
                "width":"193px"
            },
          "rules": {
            "required": true,
            "message": "报价不能为空",
            "trigger": "blur"
          }
        },{
            "type": "select",
            "value": "",
            "options":[],
            "label": "供应商",
            "name": "supplierID",
            "style": {
              "width": "100%"
            },
          "rules": {
            "required": true,
            "message": "供应商不能为空",
            "trigger": "blur"
          }
        },{
          "type": "input",
            "value": "",
            "label": "备注",
            "name": "remark",
            "style": {
              "width": "100%"
            }
        },{
            "type": "switch",
            "activeText":"启用",
            "inactiveText":"禁用",
            "value": true,
            "label": "状态",
            "name": "active",
            "style": {
              "width": "100%"
            }
        }]
      },
      tableHeight:'300px',
      dialogTitle:'',
      top: '5vh',
      visible: false,
      collapse: false,
      width: '90%',
      title: 'test',
      showSaveButton:true,
      stripe:false,
      rowClickData:null,
      selectionData:null,
      dialogUpdateFormData:null,
      newItemForm:{},
      editDialogTitleVisible:false, 
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
  },
  watch:{
    rowClickData(arg){
      console.log(arg)
      this.buttons.find(p => p.text == '编辑').disabled = arg == null
      this.buttons.find(p => p.text == '删除').disabled = arg == null
    },
    supplierTableData(arg){
      if(arg.length == 0 ) this.rowClickData = null
    }
  },
  methods: {
      updateCollapsed(arg){
          console.log(arg)
      },
      looking(){ 
        //   let param ={
        //   condition:JSON.stringify(this.$refs.masterView.condition),
        //   page:JSON.stringify(this.$refs.masterView.hdrTableData.currentPage),
        //   size:JSON.stringify(this.$refs.masterView.hdrTableData.pageSize)
        // };
        // axiosDict['basic'].get('Material/GetPageList',{
        // params:param
        // }).then(res=>{
        //     console.log(res)
        //     this.$refs.masterView.hdrTableData.data = []
        //     if(res){
        //       res.rows.map(item=> { this.$refs.masterView.hdrTableData.data.push(item) })
        //       this.$refs.masterView.hdrTableData.total = res.total 
        //     } 
        //   })
        this.COMMONLOOKING()
      },
      COMMONLOOKING(pageSize,currentPage){
        let param ={
          condition:JSON.stringify(this.$refs.masterView.condition),
          page: currentPage ? JSON.stringify(currentPage) : JSON.stringify(1),
          size: pageSize ? JSON.stringify(pageSize) : JSON.stringify(this.$refs.masterView.hdrTableData.pageSize),
        };
        axiosDict['basic'].get('Material/GetPageList',{
        params:param
        }).then(res => {
            console.log(res)
            if(res){
              this.$refs.masterView.hdrTableData.data = []
              res.rows.forEach( item=> {
                this.$refs.masterView.hdrTableData.data.push(item)
              });
              this.$refs.masterView.hdrTableData.total = res.total
            }
          })
      },
      offer(){  
        console.log()
        this.materialTableData = []
        this.materialTableData.push(this.selectionData[0])   
        this.dialogVisible = true
        // 请求供应商数据 放入下拉选择框
        axiosDict[apiName].get(this.supplierURL).then(res=>{
          console.log(res)
          this.editDialogFormItems.form[1].options = []
          if(res)res.map(item=>{this.editDialogFormItems.form[1].options.push({value:item.id,label:item.name})})
        })
        this.offerQuery()
      },
      offerQuery(isShowDtlTable){
          let idValue = ""
          isShowDtlTable ? idValue = isShowDtlTable.id : idValue = this.selectionData[0].id
          let param = {
          condition:JSON.stringify([{"FieldName":"materialID","TableName":"[Supplier_Quotation]","Value":[{"value": idValue }],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]),
          orderBy:"CreateDate desc"
        }
        axiosDict[apiName].get('Supplier_Quotation/GetList',{
        params:param
        }).then(res=>{
          console.log(res, this.$refs.masterView.dtlTableData)
          isShowDtlTable ? this.$refs.masterView.dtlTableData[0].data = [] : this.supplierTableData = []
          if(res) res.map(item=>{ isShowDtlTable ? this.$refs.masterView.dtlTableData[0].data.push(item) : this.supplierTableData.push(item) }) 
        })
      },
      // 下来选择框筛选方法
      // querySearch(queryString, cb, labelData) {
      //     console.log(queryString, cb,labelData)
      //       let index =  this.editDialogFormItems.form.findIndex(p=>{
      //             return p.label == labelData
      //         })
      //         var results = queryString ? this.editDialogFormItems.form[index].data.filter(this.createFilter(queryString)) : this.editDialogFormItems.form[index].data
      //         console.log(results)
      //         cb(results)
      //   },
      //   createFilter(queryString) {
      //     console.log(queryString)
      //     return name => {
      //       return ( 
      //         name.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      //       )
      //     }
      //   },
      tableBackEvent(){
        this.$refs.formItems.clearForm()
        this.$refs.formItems.resetForm()
        this.editDialogFormItems.form.forEach(p=>p.value = '')
        this.editDialogTitleVisible = false
      },
      tableSaveEvent(){
        if(this.$refs.formItems.validateForm()){      
          this.dialogUpdateFormData.price = Number(this.dialogUpdateFormData.price).toFixed(2)
          console.log(this.dialogUpdateFormData)
          if(this.dialogTitle == '新增报价'){
            let newFormData = Object.assign(this.newItemForm,this.dialogUpdateFormData)
            newFormData.materialID = this.selectionData[0].id
            // newFormData.id = this.selectionData[0].id
            newFormData.name = this.selectionData[0].name
            // newFormData.supplierID = this.selectId
            console.log(newFormData)
            axiosDict[apiName].post('Supplier_Quotation',newFormData).then(res=>{
              console.log(res)
              if(res){
                Vue.prototype.$notify.success({
                    title: '新增数据成功',
                    message: '新增数据成功',
                    duration: 2000,
                  })
                // this.supplierTableData.unshift(res)
                 this.offerQuery()
                this.tableBackEvent()
               
              }
            })
          }
        else if(this.dialogTitle == '编辑报价'){
          let newFormData = Object.assign(this.rowClickData,this.dialogUpdateFormData)
          console.log(newFormData)
          axiosDict[apiName].put('Supplier_Quotation',newFormData).then(res=>{
              console.log(res)
              if(res){
                 Vue.prototype.$notify.success({
                    title: '修改数据成功',
                    message: '修改数据成功',
                    duration: 2000,
                  })
                 // this.supplierTableData[this.supplierTableData.indexOf(this.rowClickData)] = Object.assign( this.supplierTableData[this.supplierTableData.indexOf(this.rowClickData)],res)
                  
                  // this.rowClickData = Object.assign(this.rowClickData,res)
                  this.offerQuery()
                  this.tableBackEvent()
              }
            })
        }
         console.log(this.rowClickData)
        }      
      },
      outSelection(arg){
        // this.buttons.find(p=>p.text == '删除').disabled = arg.length !== 1
        // if(arg.length != 0){
        //   this.selectionData = []
        //   arg.map(item=>{
        //     this.selectionData.push(item)
        //   })
        // }        
      },
      outRowClick(arg){
        console.log(arg)
        this.rowClickData = arg 

      },
    
      chooseSupplier(){
        this.dialogs[0].title = '选择供应商'              
        this.dialogs[0].src = `../Supplier/index.html#${token}#id#${this.dialogs[0].name}`
          setTimeout(() => {
            getDialog(this.dialogs,'dialog').visible = true
          }, 100)
      },
      buttonClick(args){
        switch (args.currentTarget.textContent.trim()) {
          case '编辑':
              { let i
                this.editDialogFormItems.form.map(item=>{
                  for(i in this.rowClickData){
                    if(i == item.name)item.value = this.rowClickData[i]
                    // if(i == 'price'){
                    //   console.log(item.value,Number(item.value))
                    //   item.value =  Number(item.value).toFixed(2)
                    // } 
                  }
                })
                this.dialogTitle = '编辑报价'
                this.editDialogTitleVisible = true
                break;
              }
          case '新增':
              {
                this.dialogTitle = '新增报价'
                this.editDialogTitleVisible = true
                axiosDict[apiName].get('Supplier_Quotation/NewItem').then(res=>{
                  console.log(res)
                  if(res)this.newItemForm = res
                })
                 break;  
              }
          case '删除':
              {
                  this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                        axios({
                          method:"delete",
                          url:apiDict[apiName] + 'Supplier_Quotation',
                          data:this.rowClickData             
                        }).then(res=>{
                          console.log(res)
                          if(res){
                            this.offerQuery()
                            Vue.prototype.$notify.success({
                                title: '删除数据成功',
                                message: '删除数据成功',
                                duration: 2000,
                              })     
                          }             
                        })
                    }).catch((e) => {
                      this.$message({
                        type: 'info',
                        message: e,
                        duration: 1000
                      });
                    });
                  
                break;
              }        
          default:
            break;
        }
      },
      customNew(){
        this.dialogVisible = true
      },
      backEvent(){
          // console.log(this.$refs.coolForm)
          //  this.$refs.coolForm.clearForm()
          //  this.$refs.coolForm.resetForm()
          this.supplierTableData = []
          this.rowClickData = null
          this.dialogVisible = false
      },
      masterUpdateForm(){

      },
      //cool-single-view 
      tableRowClick(arg){
        this.offerQuery(arg)
       // this.$refs.masterView.$refs.table.$refs.table.$refs.table.toggleRowSelection(arg)
      },
      tableRowDblclick(arg){
    
      },
      tableSelectionChange(arg){
        this.selectionData=[]
        if(arg.length != 0) arg.map(item=>{this.selectionData.push(item)})     
      },  
      paginationSizeChange(arg){
        console.log(arg)
        this.$refs.masterView.hdrTableData.currentPage = 1
        this.$refs.masterView.hdrTableData.pageSize = arg
        this.COMMONLOOKING(this.$refs.masterView.hdrTableData.pageSize)
      },
      paginationCurrentChange(arg){
        console.log(arg)
        this.$refs.masterView.hdrTableData.currentPage = arg
        this.COMMONLOOKING(this.$refs.masterView.hdrTableData.pageSize,this.$refs.masterView.hdrTableData.currentPage)
      },  
      getCondition(arg,value,label,data){
       if(label == '物料大类' && data.find(p=>p.FieldName =='materialClass')){
        if(data.find(p=>p.FieldName =='materialClass').Value[0].value !== ''){
          if(this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.length !== 0){
            this.$refs.masterView.queryCondition.materialSubclass.options = this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.map(item=>{ return {value:item.name,label:item.name} })
            if(data.find(p=>p.FieldName =='materialClass').Value[0].value!== '' && !this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='materialClass').Value[0].value).children.some(item=>{ return item.name === this.$refs.masterView.queryCondition.materialSubclass.value})){
                    this.$refs.masterView.queryCondition.materialSubclass.value = ''
                    data.find(p=>p.FieldName =='materialSubclass').Value[0].value= ''
                  }
          }
          else
            this.$refs.masterView.queryCondition.materialSubclass.options =[]
        }else{
          this.$refs.masterView.queryCondition.materialSubclass.options = []
          this.$refs.masterView.queryCondition.materialSubclass.value = ''
          data.find(p=>p.FieldName =='materialSubclass').Value[0].value= ''
        }
       }
      },
      // cool-single-dialog
      updateForm(arg){
        console.log(arg)
        this.dialogUpdateFormData = arg
      },
      saveEvent(arg){
        // this.$message('努力开发中 别急')
      }
  }
})