function postSelection(args, source) {
      let data = {
        data:vm.HASCHOOSEDATA,
        closeDialog:true
      }
      source.postMessage({ method: 'passSelection', args: { data: data, to: args.to } }, '*')
  }

function alertData(args) {

}
window.formatterMethods = {

}
var resourceName = 'Supplier'//资源名称 模板生成
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
      isTableSelectionChange:true,
      isPaginationSizeChange:true,
      isPaginationCurrentChange:true,
      isTableRowClick:true
     },
      // 弹出框 固定格式 里面的值可按以下定义 需模板生成
     dialogs: [
     {
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
     dialogTitle:"供应商管理",
     editDialogTitle:"联系人管理",
     editDialogVisible:false,
     justDialogWidth:'900px',
     editDialogWidth:"400px",
     showSaveButton:true,      
     formItems:{},
     dtlButtons:[],
     attaButtons:[],
     contactData:[],
     bankData:[],
     attachmentData:[],
     contactColumns:[],
     bankColumns:[],
     attaColumns:[],
     customerNewItem:{},
     contactNewItem:{},
     bankNewItem:{},
     contactFormItems:{},
     bankFormItems:{},
     editFormItems:{},
     isEdit:false,
     isDtlEdit:false,
     formItemsData:null,
     isSaveDisabled:false,
     currentData:null,
     selectionData:[],
     editFormItemsData:null,
     currentNewData:null,
     tableHeigh:'250px',
     HASCHOOSEDATA:null,
     provideReceiptData:null,
     uploadDialogVisible: false,
     parentId: undefined,
     parentType: '供应商管理',
     province: [],
     city: [],  
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
     if(window.location.hash.split('#')[3] !== undefined){
       this.$refs.masterView.buttons = this.$refs.masterView.buttons.slice(0,1)
       this.looking()
    }
    this.getNewItem()
    this.getCustomerNewItem()
    
    for (let i in window.coolLocals) {
      for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
        if(p == 'dtlTableData'){
          this.contactColumns = JSON.parse(window.coolLocals[i])[p][0].columns
          this.bankColumns = JSON.parse(window.coolLocals[i])[p][1].columns
          this.attaColumns = JSON.parse(window.coolLocals[i])[p][2].columns
        }
      }
    }
    // 省份数据
    this.$nextTick(() => {
      let province = this.province.map(p => ({
        value: p.name,
        province: p.province
      }))
      this.formItems.form.find(p => p.label == '省份').options = province
    })
    // 获取结算方式数据
    axiosDict['basic'].get('Settlement/GetList?condition=[]').then(res=>{
      console.log(res)
      if(res)this.formItems.form.find(p=>p.name == 'payment').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })
    // 发票 税率数据
    axiosDict['basic'].get('TypeofInvoice/GetList?condition=[]').then(res=>{
      console.log(res)
      if(res){
        this.provideReceiptData = res
        this.formItems.form.find(p=>p.name == 'provideReceipt').options = res.map(item=>{ return {value:item.name,label:item.name} })
      }
    })
  },
  computed:{
    defaultBankAccount:function(){
        if(this.bankData.length >0) return this.bankData.map(item=>{return {value:item.id,label:item.name}})
        else return []
    },
    defaultContact:function(){
      if(this.contactData.length >0) return this.contactData.map(item=>{return {value:item.id,label:item.name}})
        else return []
    }
  },
  watch:{
    defaultBankAccount(arg){
      console.log(arg)
      this.formItems.form.find(p=>p.name == "defaultBankAccountID").options =arg
    },
    defaultContact(arg){
      console.log(arg)
      this.formItems.form.find(p=>p.name == "defaultContactID").options =arg
    }
  },
  methods: {
         uploadSuccess(response){
              console.log(response);
              axiosDict[apiName].get('Supplier_Attachment/NewItem').then(res=>{
                console.log(res)
                res.attachmentID =response[0].id
                res.parentID =response[0].parentID
                res.description =response[0].description
                res.parentType =response[0].parentType
                res.name =response[0].name
                res.type = "普通附件"
               axiosDict[apiName].post('Supplier_Attachment',res).then(data=>{
                console.log(data)
                this.attachmentData.push(data)
              })
              })
            },
        handleClick(tab,event){
          this.$refs.contactTable.clearSelectionOuter()
          this.$refs.bankTable.clearSelectionOuter()
          this.$refs.attaTable.clearSelectionOuter()
        },
        dltSelection(arg){
          console.log(arg)
          this.selectionData = arg
          this.dtlButtons.find(p=>p.text == '修改').disabled = arg.length !== 1 
          this.dtlButtons.find(p=>p.text == '删除').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '下载').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '删除').disabled = arg.length !== 1   
        },
        contactBtnEvent(args){
          switch (args.currentTarget.textContent.trim()) {
              case '新增' :
              {
                 this.editDialogTitle = '联系人管理'
                 this.editFormItems = this.contactFormItems
                 this.editDialogVisible = true
                 break
              }
              case '修改' :
              {
                this.editDialogTitle = '联系人管理'
                this.editFormItems = this.contactFormItems
                this.isDtlEdit = true
                this.$nextTick(()=>{
                  this.editFormItems.form.map(item=>{
                  for(let i in this.selectionData[0]){
                    if(i == item.name)item.value = this.selectionData[0][i]
                  }
                })
                })   
                this.editDialogVisible = true
                break
              }
              case '删除' :
                {
                  axiosDict['basic']({
                    method:"delete",
                    url:"Contact",
                    data:this.selectionData[0]
                  }).then(res=>{
                    console.log(res)
                    if(res){
                      Vue.prototype.$notify.success({
                        title: '',
                        message: '删除成功',
                        duration: 2000,
                      })       
                        this.contactData.splice(this.contactData.indexOf(this.selectionData[0]), 1)
                    }
                  })
                  break
                }
            }
        },

        bankBtnEvent(args){
             switch (args.currentTarget.textContent.trim()) {
              case '新增' :
              {
                 this.editDialogTitle = '银行账户管理'
                 this.editFormItems = this.bankFormItems
                 this.editDialogVisible = true
                 break
              }
              case '修改' :
              {
                this.editDialogTitle = '银行账户管理'
                this.isDtlEdit = true
                this.editFormItems = this.bankFormItems
                this.$nextTick(()=>{
                  this.editFormItems.form.map(item=>{
                  for(let i in this.selectionData[0]){
                    if(i == item.name)item.value = this.selectionData[0][i]
                  }
                })
                })
                this.editDialogVisible = true
                break
              }
              case '删除' :
                {
                  axiosDict['basic']({
                    method:"delete",
                    url:"BankAccount",
                    data:this.selectionData[0]
                  }).then(res=>{
                    console.log(res)
                    if(res){
                      Vue.prototype.$notify.success({
                        title: '',
                        message: '删除成功',
                        duration: 2000,
                      })       
                        this.bankData.splice(this.bankData.indexOf(this.selectionData[0]), 1)
                    }
                  })
                  break
                }
            }
        },
         attaBtnEvent(args){
             switch (args.currentTarget.textContent.trim()) {
              case '新增' :
              {
                 this.parentId = this.isEdit ? this.currentData.id : this.isSaveDisabled ? this.currentNewData.id : this.customerNewItem.guid
                 this.uploadDialogVisible = true
                 break
              }
              case '下载' :
              {
                downloadFiles(this.selectionData[0].attachmentID)
                break
              }
              case '删除' :
                {
                  axiosDict[apiName]({
                    method:"delete",
                    url:"Supplier_Attachment",
                    data:this.selectionData[0]
                  }).then(res=>{
                    console.log(res)
                    if(res){
                      Vue.prototype.$notify.success({
                        title: '',
                        message: '删除成功',
                        duration: 2000,
                      })       
                        this.attachmentData.splice(this.attachmentData.indexOf(this.selectionData[0]), 1)
                    }
                  })
                  break
                }
            }
        },
        looking(){
          this.$refs.masterView.hdrTableData.currentPage =1
          this.QUERYDATA()
        },
        QUERYDATA(){
          this.$refs.masterView.dtlTableData.forEach(p=>{p.data.splice( 0, p.data.length)})
          let param ={
            condition:JSON.stringify(this.$refs.masterView.condition),
            page: JSON.stringify(this.$refs.masterView.hdrTableData.currentPage),
            size: JSON.stringify(this.$refs.masterView.hdrTableData.pageSize),
          };
          axiosDict[apiName].get(this.uniqueKey + '/GetPageList?',{
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
        getCustomerNewItem(){
          axiosDict[apiName].get('Supplier/NewItem').then(res=>{
            console.log(res)
            this.customerNewItem = res
          })
        },
        getNewItem(){
          axiosDict['basic'].get('Contact/NewItem').then(res=>{
            console.log(res)
            delete res.guid
            this.contactNewItem = res
          })
          axiosDict['basic'].get('BankAccount/NewItem').then(res=>{
            console.log(res)
            delete res.guid
            this.bankNewItem = res
          })
        },
        customNew(){
          this.dialogVisible = true
          // this.getNewItem()
        },
        customEdit(){
          this.isEdit = true
          this.searchBank(this.currentData.id,true)
          this.searchContact(this.currentData.id,true)
          this.getUploadedData(this.currentData.id,true)
          this.$nextTick(function(){
          this.formItems.form.forEach(p=>{
            for(let i  in this.currentData){
              if(i== p.name)p.value = this.currentData[i]
            }
          })
          this.$refs.coolFormItems.updateForm()
        })
          this.dialogVisible = true
        },
        customDelete(){
          this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axiosDict[apiName]({
              method:"delete",
              url:this.uniqueDeployKey.api,
              data:this.currentData
            }).then(res=>{
              console.log(res)
              if(res){
                if(this.$refs.masterView.hdrTableData.currentPage != 1 && this.$refs.masterView.hdrTableData.data.length == 1){
                  this.$refs.masterView.hdrTableData.currentPage -= 1
                  this.QUERYDATA()
                }else{
                  this.QUERYDATA()
                }
                Vue.prototype.$notify.success({
                  title: '',
                  message: '删除成功',
                  duration: 2000,
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
        },
        tableSaveEvent(){
          if (this.$refs.coolFormItems.validateForm()) {
                    // 判断编辑还是新建
                    this.isEdit
                        ? (this.formItemsData = Object.assign(
                              this.currentData,
                              this.formItemsData,
                          ))
                        : (this.formItemsData = Object.assign(
                              this.customerNewItem,
                              this.formItemsData,
                          ))
                    if (this.isEdit) {
                      console.log(this.formItemsData)
                        axiosDict[apiName]
                            .put(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    this.currentData = Object.assign( this.currentData, res )      
                                }                                
                            })
                    } else {
                      if(this.formItemsData.defaultContactID == "" && this.contactData.length > 0)this.formItemsData.defaultContactID = this.contactData[0].id
                        if(this.formItemsData.defaultBankAccountID == "" && this.bankData.length > 0)this.formItemsData.defaultBankAccountID = this.bankData[0].id
                        console.log(this.formItemsData)
                        axiosDict[apiName]
                            .post(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (this.isEdit == false && res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    this.currentNewData = JSON.parse(JSON.stringify(res))
                                    this.$refs.masterView.hdrTableData.data.unshift(res)
                                    this.isSaveDisabled =true
                                    this.getCustomerNewItem()
                                }
                            })
                    }
                }
        },
        tableBackEvent(){
          this.$refs.coolFormItems.clearForm()
          this.$refs.coolFormItems.resetForm()
          this.$refs.masterView.dtlTableData.forEach(p=>{p.data.splice( 0, p.data.length)})
          this.bankData = []
          this.contactData = []
          this.attachmentData =[]
          this.isSaveDisabled = false
          this.formItemsData = null
          this.isEdit = false
          this.currentNewData = null
          this.dialogVisible = false
        },
        editTableSaveEvent(){
          if (this.$refs.editFormItems.validateForm()) {
               this.editDialogTitle == '银行账户管理' ? this.commonSaveEvent(this.bankNewItem,'BankAccount') : this.commonSaveEvent(this.contactNewItem,'Contact')
          }
        },
        commonSaveEvent(newItem,url){
          // 判断编辑还是新建
                    this.isDtlEdit
                        ? (this.editFormItemsData = Object.assign(
                              this.selectionData[0],
                              this.editFormItemsData,
                          ))
                        : (this.editFormItemsData = Object.assign(
                              newItem,
                              this.editFormItemsData,
                          ))
                    console.log(this.editFormItemsData)
                    this.isEdit ? this.editFormItemsData.parentID = this.currentData.id  : this.isSaveDisabled ? this.editFormItemsData.parentID = this.currentNewData.id : this.editFormItemsData.parentID = this.customerNewItem.guid
                    if (this.isDtlEdit) {
                        axiosDict['basic']
                            .put(url, this.editFormItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    this.selectionData[0] = Object.assign( this.selectionData[0], res )
                                    this.editDialogVisible = false
                                }                                
                            })
                    } else {
                        axiosDict['basic']
                            .post(url, this.editFormItemsData)
                            .then(res => {
                                console.log(res)
                                if (this.isDtlEdit == false && res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    this.editDialogTitle == '银行账户管理' ?  this.bankData.unshift(res) : this.contactData.unshift(res)
                                    this.editDialogVisible = false
                                }
                            })
                    }
        },
        editTableBackEvent(){
          this.isDtlEdit = false
          this.$refs.editFormItems.clearForm()
          this.$refs.editFormItems.resetForm()
          this.editFormItemsData = null
          this.editDialogVisible = false
        },
      //cool-single-view 
      tableRowClick(arg){
       console.log(arg)
       this.searchBank(arg.id)
       this.searchContact(arg.id)
       this.getUploadedData(arg.id)
      },
      // 查询银行账户
      searchBank(customerId,edit){
        axiosDict['basic'].get(`BankAccount/GetList?condition=[{"FieldName":"parentID","TableName":"[BankAccount]","Value":[{"value":"${customerId}"}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`).then(res=>{
          console.log(res)
          this.$refs.masterView.dtlTableData[1].data = []
          this.bankData = []
          if(res){
            edit ? res.forEach(p=>{this.bankData.push(p)})  : res.forEach(p=>{this.$refs.masterView.dtlTableData[1].data.push(p)})
          }
        })
      },
      // 查询联系人
      searchContact(customerId,edit){
        axiosDict['basic'].get(`Contact/GetList?condition=[{"FieldName":"parentID","TableName":"[Contact]","Value":[{"value":"${customerId}"}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`).then(res=>{
          console.log(res)
          this.$refs.masterView.dtlTableData[0].data = []
          this.contactData = []
          if(res){
            edit ? res.forEach(p=>{this.contactData.push(p)}) : res.forEach(p=>{this.$refs.masterView.dtlTableData[0].data.push(p)})
          }
        })
      },
      // 获取附件列表
        getUploadedData(customerId,edit) {
          // let newData = this.isEdit ? this.currentData.id : this.customerNewItem.guid
          let params =  [{"FieldName":"parentID","TableName":"[Supplier_Attachment]","Value":[{"value":customerId}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]
          axiosDict[apiName].get(`Supplier_Attachment/GetList?condition=${JSON.stringify(params)}`).then(res=>{
            console.log('附件列表',res);
            this.$refs.masterView.dtlTableData[2].data = []
            this.attachmentData = []
            if(res){
              edit ? res.forEach(p=>{this.attachmentData.push(p)}) :res.forEach(p=>{this.$refs.masterView.dtlTableData[2].data.push(p)})
            }
          })
        },
      tableRowDblclick(arg){
    
      },
      tableSelectionChange(arg){
        console.log(arg)
        this.HASCHOOSEDATA = arg
        this.currentData = arg[0]
      },  
      paginationSizeChange(arg){
        console.log(arg)
         this.$refs.masterView.hdrTableData.currentPage = 1
         this.$refs.masterView.hdrTableData.pageSize = arg
         this.QUERYDATA()
      },
      paginationCurrentChange(arg){
        console.log(arg)
        this.$refs.masterView.hdrTableData.currentPage = arg
        this.QUERYDATA()
      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg,val,label){
        console.log(arg)
        this.formItemsData = arg
        if(label == "发票类型" && arg.provideReceipt !== ''){
          if(this.provideReceiptData.find(p=>p.name == arg.provideReceipt)){
            arg.cess = this.provideReceiptData.find(p=>p.name == arg.provideReceipt).cess
             this.formItems.form.find(p=>p.name == 'cess').value = arg.cess
             arg.provideReceipt = this.provideReceiptData.find(p=>p.name == arg.provideReceipt).name 
          }
                    
        }else{
          if(arg && arg.provideReceipt == ''){
             arg.cess = ''
             this.formItems.form.find(p=>p.name == 'cess').value = ''
          }
        }
        if (label == '省份') {
        this.formItems.form.find(p => p.label == '城市').value = ''
        arg.city = ''
        if (isEmpty(val)) {
          this.formItems.form.find(p => p.label == '城市').options = []
        } else {
          let currentProvince = this.formItems.form.find(p => p.label == '省份').options.find(p => p.value == val).province
          this.formItems.form.find(p => p.label == '城市').options = this.city.filter(p => p.province == currentProvince).map(c => ({
            value: c.name
          }))
        }
      }
      },
      editUpdateForm(arg){
        this.editFormItemsData = arg
      },
      saveEvent(arg){

      }
  }
})