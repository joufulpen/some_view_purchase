function passSelection({ to, data }) {
    console.log(1,'passSelection')
    document.getElementById(to).contentWindow.postMessage({ method: 'alertData', args: data }, '*')
    console.log(to,data)
    if(vm.dialogs[0].title == '选择供应商'){
      if(data.data.length == 1){
      if(data.hasOwnProperty('closeDialog') && to == 'dialog'){
        vm.supplierData = []
        data.data.map(item=>{
          vm.supplierData.push(item)
        })
        console.log(vm.supplierData)
        vm.dealWithSupplierData()
        if(vm.inTableData.length != 0)vm.findPrice()
      vm.dialogs[0].visible = !vm.dialogs[0].visible
      }
      }else{
        vm.$message('抱歉 只能选一条数据')
      }
    }else{
      if(data.hasOwnProperty('closeDialog') && to == 'dialog'){
          // let filterData = data.data.filter(a => !vm.inTableData.map(b => b.id).includes(a.id)).map(a => { return a })

          data.data.map(item=>{
            // axiosDict[apiName].get(vm.newDtlItemURL).then(res=>{
            //   console.log(res)
              // if(res){
                let copyData = JSON.parse(JSON.stringify(vm.dtlNewItem))
                item = Object.assign(item,{amount:0})
                delete item.formno
                delete item.guid
                delete item.ts
                item.parentSn = item.sn
                if(item.type=='玻璃'){item.categoryReferred=item.name;item.name = ''}
                vm.inTableData.push(Object.assign(copyData,item))
              // }
            // }).then(res=>{
            //   if(vm.orderFormItems[1].formItems.form.find(p=>p.name == 'supplierName').value !== '' )vm.findPrice()
            // })
        })
        if(vm.orderFormItems[1].formItems.form.find(p=>p.name == 'supplierName').value !== '' )vm.findPrice()
         vm.dialogs[0].visible = !vm.dialogs[0].visible
      }
    }
    }
// <div id="boldStuff">abv</div>
// let dom = document.getElementById(boldStuff)
// dom.innerText = 'test'
function getSelection({ from, to }) {
    console.log(2,'getSelection')
    document.getElementById(from).contentWindow.postMessage({ method: 'postSelection', args: { to } }, '*')
  }

function postSelection(args, source) {
      let data = {
        data:vm.selectData,
        closeDialog:true
      }
      source.postMessage({ method: 'passSelection', args: { data: data, to: args.to } }, '*')
    }

function alertData(args) {
  // console.log(6,'alertData',args)
  // Vue.prototype.$alert(JSON.stringify(args))
}

function onSaveReport(e) {
  //此方法会被新窗口以.call(window, e)的方式调用，所以this是新窗口window对象
  this.console.debug(e)
  this.alert('自定义的保存表单——开发中')
}

var resourceName = 'BillPurOrder'//资源名称 模板生成
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
          showSaveButton:true
        }
      ],
      showDtlTable:true,
    // newItem
    newItemURL:apiDict[apiName] +"BillPurOrder/Newhdr",
    newDtlItemURL:apiDict[apiName] +"BillPurOrder/Newdtl",
     //cool-single-dialog
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     },
     inTableData:[],
     orderFormItems:null,
     editDialogTitle:'采购订单管理',
     labelWidth:'115px',
     showButton:true,
     columns:[{
          "type": "selection"
        },
       {
          "type": "index"
        },
        {
          "prop": "code",
          "label": "物料编号"
        }
        ,
        {
          "prop": "name",
          "label": "物料名称"
        }
        ,
        {
          "prop": "byname",
          "label": "物料别名"
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
          "prop": "version",
          "label": "品牌型号"
        }
        ,
        {
          "prop": "specifications",
          "label": "物料规格"
        }
        ,

        {
          "prop": "pigment",
          "label": "物料颜色"
        }
        ,
        {
          "prop": "unit",
          "label": "采购单位"
        }
        ,
        {
          "prop": "qty",
          "label": "采购数量"
        },
        {
          "prop":"price",
          "label":"单价",
          formatter: function(arg,clo) {
            // if (arg.price) {
              return Number(arg.price).toFixed(2)
            // }
          }
        },
        {
          "prop":"amount",
          "label":"金额",
          formatter: function(arg,clo) {
            // if (arg.price && arg.leave) {
              let total = Number(arg.price) * Number(arg.leave)
              return arg.amount = total.toFixed(2)
            // }
          }
        },
        {
          "prop": "description",
          "label": "备注(采购订单备注)"
        }
        ],
        buttons:[{
        text: "选择物料",
        size: "mini",
        icon: "#iconxuanze",
        disabled: false,
        type:"success"
      },{
        text: "编辑",
        size: "mini",
        icon: "#iconERP_bianji",
        disabled: true,
        type:"info"
      },{
        text: "移除",
        size: "mini",
        icon: "#iconERP_shanchu",
        disabled: true,
        type:"danger"
      }
      ],
      dialogWidth:'445px',
      labelWidth:'145px',
      currentEditData:{},
      quickCoolFormItems:{
        form:[{
          "type": "input",
          "value": "",
          "label": "物料编号",
          "disabled":true,
          "name": "code",
          "inputStyle":{"width":"193px"},
          "style": {
            "width": "100%"
          }
        },{
          "type": "input",
          "value": "",
          "label": "物料名称",
          "disabled":true,
          "name": "name",
          "inputStyle":{"width":"193px"},
          "style": {
            "width": "100%"
          }
        },{
          "type": "input",
          "value": "",
          "label": "物料规格",
          "disabled":true,
          "name": "specifications",
          "inputStyle":{"width":"193px"},
          "style": {
            "width": "100%"
          }
        },{
          "type": "inputNumber",
          "value": "",
          "label": "采购数量",
          "inputStyle":{"width":"193px"},
          "min":0,
          "disabled":false,
          "name": "qty",
          "style": {
            "width": "100%"
          }
        },{
          "type": "inputNumber",
          "inputStyle":{"width":"193px"},
          "value": "",
          "label": "单价",
          "disabled":false,
          "name": "price",
          "style": {
            "width": "100%"
          }
        },{
          "type": "textarea",
          "value": "",
          "label": "备注(采购订单备注)",
          "inputStyle":{"width":"193px"},
          "disabled":false,
          "name": "description",
          "style": {
            "width": "100%"
          }
        }
        ]
      },
      tableHeight:'300px',
      dialogTitle:'编辑物料',
      supplierData:[],
      materialData:[],
      stripe:false,
      isEdit:false,
      rowClickData:null,
      selectionData:null,
      selectData:[],
      newHdrItemData:null,
      newDtlItemData:null,
      currentData:undefined,
      dialogUpdateFormData:null,
      rowDblclickData:null,
      allData:null,
      alreadyDelData:[],
      editDialogTitleVisible:false,
      isCheck:false,
      dtlNewItem:{},
      quickDialogVisible:false,

  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    for (let i in window.coolLocals) {
      if(i == 'dialogForm.json'){
        for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
      }
      }
    }
      // 获取newItem
     axiosDict[apiName].get(this.newDtlItemURL).then(res=>{
          console.log(res)
          if(res){
            this.dtlNewItem = res
            delete this.dtlNewItem.guid
          }
      })

    // 公司数据
    axiosDict['basic'].get('Company/GetList?condition=[]').then(res=>{
          console.log(res)
          if(res)this.orderFormItems[0].formItems.form.find(item=>item.name == 'companyID').options = res.map(p=>{ return {label:p.name,value:p.id}})
        })
    // 获取采购员
    axiosDict[apiName].get(`Buyer/GetList?condition=[{"FieldName":"active","TableName":"[Buyer]","Value":[{"value":true}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`).then(res=>{
          console.log(res)
          if(res)this.orderFormItems[0].formItems.form.find(item=>item.name == 'buyer').options = res.map(p=>{ return {label:p.name,value:p.id}})
        })
    // Arrival
    if(window.location.hash.split('#')[2] == 'Arrival'){
      this.$refs.masterView.queryCondition.checkState.disabled = true
      this.$refs.masterView.queryCondition.checkState.value = '已审核'
      this.$refs.masterView.queryCondition.checkState.mode = '等于'
      this.$refs.masterView.condition.find(p=>p.FieldName == 'checkState').Value[0].value = '已审核'
      this.$refs.masterView.buttons = this.$refs.masterView.buttons.slice(0,2)
      this.lookingURL = this.uniqueDeployKey.api + '/GetPurOrderHdr'
    }else this.lookingURL = this.uniqueDeployKey.api + '/GetPurOrderPageList'
    // 页面进入自动查询
    // this.$refs.masterView.query()
    this.looking()
  },
  watch:{
    isCheck(arg){
      console.log(arg)
      this.orderFormItems.map(item=>{
        item.formItems.form.map(p=>p.disabled = arg)
      })
      this.coolFormItems.form.map(item=>item.disabled = arg)
      this.buttons.find(p=>p.text == '选择物料').disabled = arg
    },
    rowDblclickData(arg){
      this.coolFormItems.additionButtons.buttons[0].disabled = arg == null
    }
  },
  methods: {
    print(){
      axiosDict[apiName].get(this.uniqueKey + '/PurchasePrint?formno='+ this.selectData[0].formno).then(res=>{
          console.log(res)
          return res
      }).then(res=>{
          if(this.$refs.masterView.hdrTableData.data.length != 0){
            coolSti.view({
                token: token, //实际使用时请从window取值
                url: apiDict['system']+'coolSti',
                report: '采购订单',
                template: '默认',
                data: res,
                variables: { Today: new Date() },
                pageTitle: this.selectData[0].formno+'采购订单',
                isDirectEdit: false,
                onPrintReportName: 'onPrintReport',
                id: this.selectData[0].formno,
            })
          }else this.$message('无有效数据')
      })
    },
    forcedEnd(){
      axiosDict[apiName].post( 'BillPurOrder/BillInvalid',this.selectData[0]).then(res=>{
        console.log(res)
        if(res){
          Vue.prototype.$notify.success({
                  title: '数据作废成功',
                  message: '数据作废成功',
                  duration: 2000,
                })
          this.looking()
        }
      })
    },
    check(){
      this.customEdit()
      this.isCheck = true
    },
    newDelete(){
      console.log('newDelete')
        this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          axiosDict[apiName]({
              method: 'delete',
              url: this.uniqueDeployKey.api,
              data: this.selectData[0],
            })
            .then(res => {
              console.log(res)
              if (res) this.looking()
            })
            .catch(error => {
              setTimeout(() => {
                this.$message.error('请求异常，请联系管理员')
              }, 500)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000,
          })
        })
    },
    looking(){
      this.$refs.masterView.dtlTableData[0].data.splice(
        0,
        this.$refs.masterView.dtlTableData[0].data.length,
      )
      let elseCondition = [
          {"FieldName":"Tag","TableName":"[Dtl]","Value":[{"value":false}],"TableRelationMode":"AND","Mode":"为空","DataType":"boolean"}
        ]
      let param = {
        condition: JSON.stringify(elseCondition.concat(this.$refs.masterView.condition)),
        page: JSON.stringify(this.$refs.masterView.hdrTableData.currentPage),
        size: JSON.stringify(this.$refs.masterView.hdrTableData.pageSize)
      }
      axiosDict[apiName]
        .get(this.lookingURL, {
          params: param,
        })
        .then(res => {
          console.log(res)
          if (res) {
            this.$refs.masterView.hdrTableData.data = []
            // .filter(item=>item.isChecked !==false && item.checkState !== '待审核')
            res.hasOwnProperty('rows') ? res.rows.forEach(item => {
              // 为避免有审核出错的数据  前端将数据做一遍过滤
              if(item.isChecked == false && item.checkState == "待审核") return
              else this.$refs.masterView.hdrTableData.data.push(item)
            }) : res.forEach(item => {
              this.$refs.masterView.hdrTableData.data.push(item)
            })
             this.$refs.masterView.hdrTableData.total = res.hasOwnProperty('total') ? res.total : res.length
          }
        })
    },
    audit(){
      // this.$message('开发中 别急')
      axiosDict[apiName].post('BillPurOrder/Agree',{formno:this.selectData[0].formno}).then(res=>{
          console.log(res)
          if(res){
            Vue.prototype.$notify.success({
                                title: '审核成功',
                                message: '审核成功',
                                duration: 2000,
                              })
                this.selectData[0] = Object.assign( this.selectData[0],res)
                this.$refs.masterView.clearSelectionOuter()
          }
      })
    },
    finish(){
      axiosDict[apiName].post( '/BillPurOrder/PurOrderFinish',this.selectData[0]).then(res=>{
        console.log(res)
        if(res) this.selectData[0] = Object.assign(this.selectData[0],res)
      })
    },
    rowDblclick(arg){
      this.quickEditEvent(arg)
    },
    findPrice(){
      let params
      this.inTableData.forEach(item=>{
        if(item.type != '玻璃'){
            params = {
            supplierID:this.supplierData[0].id,
            codes:item.code,
          }
          axiosDict[apiName].get('BillPurOrder/GetPrice',{params:params,}).then(res=>{
            console.log(res,res[Object.keys(res)[0]])
            if(Object.keys(res).length != 0){
                  item.price = res[Object.keys(res)[0]]
                  item.amount = item.leave * item.price
            }else return
          })
        }
        if(item.type == '玻璃'){
              params = {
              categoryName: item.categoryReferred,
              SupplierID: this.supplierData[0].id,
            }
            axiosDict[apiName].get('BillPurOrder/GetGlassPrice',{params:params,}).then(res=>{
              console.log(res,res[Object.keys(res)[0]],Object.keys(res)[0])
              if(Object.keys(res).length != 0 && Object.keys(res)[0] != ''){
                    item.price = res[Object.keys(res)[0]]
                    item.amount = item.leave * item.price
                    item.name = Object.keys(res)[0]
              }else return
            })
        }
      })
    },

      tableBackEvent(){
        this.editDialogTitleVisible = false
      },
      tableSaveEvent(){
         this.rowClickData = Object.assign(this.rowClickData,this.dialogUpdateFormData)
         this.tableBackEvent()
      },
      outSelection(arg){
        this.buttons.find(p=>p.text == '移除').disabled = arg.length === 0
        this.buttons.find(p=>p.text == '编辑').disabled = arg.length !== 1
        if(arg.length != 0){
          this.selectionData = []
          arg.map(item=>{
            this.selectionData.push(item)
          })
        }
      },
      outRowClick(arg){
        // this.buttons[1].disabled = arg == undefined
        // this.buttons[2].disabled = arg == undefined
        console.log(arg)
        this.rowClickData = arg
      },

      dealWithSupplierData(){
        this.orderFormItems[1].formItems.form.map(item=>{
          for(let i in this.supplierData[0]){
            if(i == item.name){
              item.value = this.supplierData[0][i]
            }if(item.name == 'supplierName')item.value = this.supplierData[0].name
          }
        })
      },
      dialogSaveEvent(){
        var to = 'dialog'
        let secondDialog = document.getElementById('dialog')
        secondDialog.contentWindow.postMessage({ method: 'postSelection', args: { to } }, '*')
      },
      dialogBackEvent(){
         getDialog(this.dialogs,'dialog').visible = false
      },
      chooseSupplier(){
        this.dialogs[0].title = '选择供应商'
        this.dialogs[0].src = `../Supplier/index.html#${token}#id#${this.dialogs[0].name}`
          setTimeout(() => {
            getDialog(this.dialogs,'dialog').visible = true
          }, 100)
      },
      buttonClick(args){
        console.log(args)
        switch (args.currentTarget.textContent.trim()) {
          case '选择物料':
              {
                this.dialogs[0].title = '选择物料'
                this.dialogs[0].src = `../BillPurOrder_chooseMaterial/index.html#${token}#id#${this.dialogs[0].name}#alreadyChooseData=${window.encodeURIComponent(JSON.stringify(this.inTableData))}`
                  setTimeout(() => {
                    getDialog(this.dialogs,'dialog').visible = true
                  }, 100)
                 break;
              }
          case '移除':
              {
                    this.selectionData.forEach(p => {
                    if(p.ts !== null){
                      p.recStatus = 2
                      p.deleted = true
                      this.alreadyDelData.push(p)
                    }
                    this.inTableData.splice(this.inTableData.indexOf(p), 1)
                  })
                    break;
              }
          case '编辑':
              {
                this.quickEditEvent(this.selectionData[0])
              }
          default:
            break;
        }
      },
      quickEditEvent(arg){
      this.currentEditData = arg
        this.quickDialogVisible = true
        this.quickCoolFormItems.form.forEach(item=>{
          for(let i in arg){
            if(i == item.name)item.value = arg[i]
          }
        })
        this.$refs.tableView.clearCurrentRow()
    },
      customNew(){
        this.dialogVisible = true
        this.isEdit = false
        axiosDict[apiName].get(this.newItemURL).then(res=>{
          console.log(res)
          if(res)this.newHdrItemData = res
        })

      },
      customEdit(){
           this.dialogVisible = true
           axiosDict[apiName].get('Supplier/GetList?condition=[]').then(res=>{
            console.log(res)
              if(res && res.find(p=>p.id == this.selectData[0].supplierID)){
                this.orderFormItems[1].formItems.form.find(p=>p.name == 'provideReceipt').value = res.find(p=>p.id == this.selectData[0].supplierID).provideReceipt
                this.orderFormItems[1].formItems.form.find(p=>p.name == 'cess').value = res.find(p=>p.id == this.selectData[0].supplierID).cess
              }
           })
           let param = {
              formno:this.selectData[0].formno,condition:JSON.stringify([])
            }
            axiosDict[apiName].get(this.uniqueDeployKey.api + '/GetDtlList',{
            params:param
            }).then(res => {
                console.log(res)
                if(res){
                  this.inTableData = []
                  res.forEach( item=> {
                    this.inTableData.push(item)
                  });
                }
              })
           this.orderFormItems.map(item=>{
            item.formItems.form.map(p=>{
              for(let i in this.selectData[0]){
                if(i == p.name)p.value = this.selectData[0][i]
              }
            })
           })
           this.isEdit = true
      },
      backEvent(){
          // console.log(this.$refs.coolForm)
          this.$refs.coolForm.map(item=>{
            item.clearForm()
            item.resetForm()
          })
          this.orderFormItems.map(item=>{
            item.formItems.form.map(p=>{
              p.value = ''
            })
          })
          this.$refs.masterView.clearSelectionOuter()
          this.inTableData = []
          this.rowClickData = null
          this.dialogVisible = false
          this.allData = null
          this.alreadyDelData =[]
          this.isCheck = false
      },
      masterUpdateForm(){

      },
      //cool-single-view
      tableRowClick(arg){
        // console.log(this.$refs.masterView.$refs.table.$refs.table.$refs.table.$refs.table)
        this.$refs.masterView.$refs.table.$refs.table.$refs.table.$refs.table.toggleRowSelection(arg)
      },
      tableRowDblclick(arg){
          console.log(arg)
      },
      tableSelectionChange(arg){
        this.selectData = []
        if(arg.length != 0) arg.map(item=>{this.selectData.push(item)})
        if(arg.length === 1){
          console.log(arg[0].isChecked)
          switch (arg[0].isChecked) {
            case true:
              {
                this.$refs.masterView.buttons.find(p=>p.text == '手动完成').disabled = true
                this.$refs.masterView.buttons.find(p=>p.text == '打印').disabled = true
                this.$refs.masterView.buttons.find(p=>p.text == '作废').disabled = true
                break;
              }
            case false:
              {
                switch(arg[0].checkState){
                  case '待审核':
                      {
                        this.$refs.masterView.buttons.find(p=>p.text == '手动完成').disabled = true
                        this.$refs.masterView.buttons.find(p=>p.text == '作废').disabled = true
                        break;
                      }
                  case '已审核':
                      {
                        this.$refs.masterView.buttons.map(p=>{
                          if(p.checkState == 1 && p.key !== 'delete')p.disabled = true
                          if(p.key === 'print') p.disabled = false
                          if(p.key === 'forcedEnd') p.disabled = false
                        })
                        break;
                      }
                    case '已完成':
                      {
                        this.$refs.masterView.buttons.map(p=>{
                          if(p.checkState == 1)p.disabled = true
                          if(p.checkState == 2)p.disabled = true
                        })
                        break;
                      }
                      default:
                        break;
                  }
                break;
              }

            default:
              break;
          }
        }
      console.log(arg)
      },
      paginationSizeChange(args) {
        console.log(args)
        this.$refs.masterView.hdrTableData.currentPage = 1
        this.$refs.masterView.hdrTableData.pageSize = args
        this.looking()
      },
      paginationCurrentChange(args) {
        console.log(args)
        this.$refs.masterView.hdrTableData.currentPage = args
        this.looking()
      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg){
        console.log(arg)
        this.dialogUpdateFormData = arg
      },
      saveEvent(arg){
        let isRight = this.$refs.coolForm.every(item=>{
             return item.validateForm()
        })
        let allFormData = {}
        this.orderFormItems.map(item => {
            item.formItems.form.map(p=>{
              allFormData[p.name] = p.value
            })
        })
        console.log(this.supplierData)
        allFormData.supplierID = this.isEdit ? this.selectData[0].supplierID : this.supplierData[0].id
        console.log(isRight,allFormData)
        if(isRight){
                if(this.inTableData.length){
              // 判断编辑还是新建
              console.log(this.isEdit,allFormData,this.selectData[0],this.newHdrItemData)
              this.isEdit ? allFormData = Object.assign(this.selectData[0],allFormData) : allFormData = Object.assign(this.newHdrItemData,allFormData)
              // if(allFormData.hasOwnProperty('billDateTime')) allFormData.billDateTime = dayjs(allFormData.billDateTime).format("YYYY-MM-DD HH:mm")
              // if(this.isEdit) allFormData.RecStatus = 1  //该处仅为测试
              console.log(allFormData)
              let param
              this.allData = this.inTableData.concat(this.alreadyDelData)
              this.isEdit ? param = { hdr:allFormData,dtls:this.allData } : param = { "hdr":allFormData,"dtls":this.inTableData}
              console.log(param)
              if(this.isEdit){
                delete param.hdr.isChecked
                param.hdr.recStatus = 1
                param.dtls.map(p=>{
                  // p.qty = p.leave
                  if(p.ts !== null && p.recStatus != 2)p.recStatus = 1
                })
                axiosDict[apiName].post(this.uniqueKey + '/Save', param).then(res=>{
              console.log(res)
              if(res){
                // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
                Vue.prototype.$notify.success({
                                title: '编辑数据成功',
                                message: '编辑数据成功',
                                duration: 2000,
                              })
                // let currentDataIndex =  this.$refs.masterView.hdrTableData.data.findIndex(item=>{
                //   return  item.guid == res.guid
                // })
                // console.log(currentDataIndex)
                this.selectData[0] = Object.assign( this.selectData[0],res)
                allFormData = null
                this.backEvent()
              }
            })
              }else{
                delete param.hdr.isChecked
                // param.dtls.map(p=>{
                //   p.qty = p.leave
                // })
                axiosDict[apiName].post(this.uniqueKey + '/Save', param).then(res=>{
                console.log(res)
              if(res){
                // 新建 直接push进去表格数据中 感觉新建完的数据应该在第一条
                Vue.prototype.$notify.success({
                                title: '新增数据成功',
                                message: '新增数据成功',
                                duration: 2000,
                              })
                  this.$refs.masterView.hdrTableData.data.unshift(res)
                  allFormData = null
                  this.backEvent()
             }
            })
              }
            }else{
              this.$message({
                          type: 'warning',
                          message: '必须输入单据明细',
                          duration: 1500
                      });
            }
          }
      }
  }
})
