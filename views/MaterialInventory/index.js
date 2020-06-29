function postSelection(args, source) {
  // console.log(5,'postSelection',args,source)
  let data = {
    data: vm.HASCHOOSEDATA,
    closeDialog: true,
  }
  source.postMessage(
    {
      method: 'passSelection',
      args: {
        data: data,
        to: args.to,
      },
    },
    '*'
  )
}

function alertData(args) {
  // console.log(6,'alertData',args)
  // Vue.prototype.$alert(JSON.stringify(args))
}
var resourceName = 'Material' //资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
    uniqueDeployKey: {
      api: apiDict[apiName] + resourceName,
    },
    // axiosSetting 固定格式 需模板生成生成
    axiosSetting: {
      baseURL: apiDict[apiName],
    },
    // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
    isMethods: {
      isGetCondition: false,
      isTableSelectionChange: false,
      isPaginationSizeChange: true,
      isPaginationCurrentChange: true,
    },
    showModeList: true,
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
      },
    ],

    // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
    currentData: null,
    HASCHOOSEDATA: null,
    materialOptions: null,
    pagination: {
      current: '1',
      offset: '10',
    },
    dialogVisible: false,
    editDialogTitle: '物料库存变化',
    dialogWidth: '850px',
    changeTableData: [],
    tableHeight: '300px',
    inColumns: [
      {
        type: 'index',
      },
      {
        prop: 'type',
        label: '变化类型',
      },
      {
        prop: '',
        label: '对应单据号',
      },
      {
        prop: '',
        label: '经手人',
      },
      {
        prop: '',
        label: '时间',
      },
      {
        prop: 'qty',
        label: '数量',
      },
    ],
  },
  mounted() {
    for (let i in window.coolLocals) {
      if (i == 'dialogForm.json') {
        for (let p in JSON.parse(window.coolLocals[i])) {
          this[p] = JSON.parse(window.coolLocals[i])[p]
        }
      }
    }
    this.$refs.singleView.singleTableData.cellClassName = this.tableCellClassName

    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    console.log(window.location.hash.split('#')[3], window.location.hash.split('#')[2])
    // window.location.hash.split('#')[3] !== undefined ||
    // if (window.location.hash.split('#')[2] == 'ApplyMaterial') {
    //   this.$refs.singleView.query()
    // }
    // 物料类型数据
    axiosDict['basic'].get('TypeofMaterial/GetList?condition=[]&orderby=').then(res => {
      console.log(res)
      if (res) this.materialOptions = res
    })
    axiosDict['warehouse'].get('Warehouse/GetList?condition=[]').then(res => {
      console.log(res)
      let options = res.map(p => ({
        value: p.id,
        label: p.name,
      }))
      this.$refs.singleView.queryCondition.whid.options = options
      this.$refs.singleView.queryCondition.whid.value = options[0].value
      this.$refs.singleView.condition.find(p => p.FieldName == 'whid').Value = [{ value: options[0].value }]
    })
    // if (window.location.hash.split('#')[2] == 'ApplyMaterial') this.searchData()
    window.location.hash.split('#')[2] == 'ApplyMaterial' && this.searchData()
  },
  methods: {
    backEvent(){},
    storeChange(){
      this.dialogs[0].title = '物料库存变化'
      this.dialogs[0].src = `../CheckChange/index.html#${token}#${this.currentData.id}#${this.$refs.singleView.queryCondition.whid.value}#${this.dialogs[0].name}#chooseOrder`
      setTimeout(() => {
        getDialog(this.dialogs, 'dialog').visible = true
      }, 100)
    },
    //生成excel
    outputExcel(res, whidValue) {
      let nameList = ['code', 'codeName', 'specifications', 'unit', 'stockLeave', 'averagePrice', 'arrivalPrice','recentlyArrivalPrice','materialClass', 'materialSubclass']
      let storeName = this.$refs.singleView.queryCondition.whid.options.find(p => p.value == whidValue).label
      axios
        .get('template.xlsx', { responseType: 'blob' })
        .then(rTemplate => window.XlsxPopulate.fromDataAsync(rTemplate.data))
        .then(workbook => {
          let sheet = workbook.sheet('Sheet1')
          let packages = Array.from(res)
          let row = 1
          packages.forEach(pack => sheet.cell(++row, 1).value([nameList.map(name => pack[name])]))
          return workbook.outputAsync()
        })
        .then(blob => window.saveAs(blob, storeName + '物料库存.xlsx'))
    },
    output(res) {
      let whidValue = this.$refs.singleView.$refs.query.condition.find(p => p.FieldName == 'whid').Value[0].value
      if (whidValue == '') this.$message('请先选择仓库后 再导出')
      else {
        // axiosDict[apiName]
        //   .post('Goods_Pur/Export', {
        //     OrderBy: 'CreateDate desc',
        //     whid: whidValue,
        //   })
        axiosDict[apiName]
          .get(`Goods_Pur/Export?condition=${JSON.stringify(this.$refs.singleView.condition)}&Orderby=CreateDate desc`)
          .then(res => {
            console.log(res)
            this.outputExcel(res, whidValue)
          })
      }
    },
    //cool-single-view
    tableRowClick(arg) {},
    tableRowDblclick(arg) {},
    tableSelectionChange(arg) {
      console.log(arg)
      this.$refs.singleView.buttons.find(p => p.text == '库存变化').disabled = arg.length !== 1
      this.currentData = arg[0]
      this.HASCHOOSEDATA = arg
    },
    paginationSizeChange(arg) {
      this.pagination.current = 1
      this.pagination.offset = arg
      this.searchData()
    },
    paginationCurrentChange(arg) {
      this.pagination.current = arg
      this.searchData()
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.label == '库存数量' && row.num < row.safeStock) return 'danger-stockBalance'
      else return ''
    },
    getCondition(arg, value, label, data) {
      if (label == '物料大类' && data.find(p => p.FieldName == 'MaterialClass')) {
        if (data.find(p => p.FieldName == 'MaterialClass').Value[0].value !== '') {
          if (this.materialOptions.find(p => p.name == data.find(p => p.FieldName == 'MaterialClass').Value[0].value).children.length !== 0) {
            this.$refs.singleView.queryCondition.MaterialSubclass.options = this.materialOptions
              .find(p => p.name == data.find(p => p.FieldName == 'MaterialClass').Value[0].value)
              .children.map(item => {
                return { value: item.name, label: item.name }
              })
            if (
              data.find(p => p.FieldName == 'MaterialClass').Value[0].value !== '' &&
              !this.materialOptions
                .find(p => p.name == data.find(p => p.FieldName == 'MaterialClass').Value[0].value)
                .children.some(item => {
                  return item.name === this.$refs.singleView.queryCondition.MaterialSubclass.value
                })
            ) {
              this.$refs.singleView.queryCondition.MaterialSubclass.value = ''
              data.find(p => p.FieldName == 'MaterialSubclass').Value[0].value = ''
            }
          } else this.$refs.singleView.queryCondition.MaterialSubclass.options = []
        } else {
          this.$refs.singleView.queryCondition.MaterialSubclass.options = []
          this.$refs.singleView.queryCondition.MaterialSubclass.value = ''
          data.find(p => p.FieldName == 'MaterialSubclass').Value[0].value = ''
        }
      }
      this.pagination.current = 1
    },
    searchData() {
      this.$refs.singleView.singleTableData.data = []
      let condition = JSON.parse(JSON.stringify(this.$refs.singleView.condition))
      condition = condition.filter(p => p.FieldName !== 'whid')
      let param = {
        condition: JSON.stringify(condition),
      }
      axiosDict['purchase']
        .get(`Goods_Pur/GetPageList?size=${this.pagination.offset}&page=${this.pagination.current}`, {
          params: param,
        })
        .then(res => {
          console.log('获取采购属性', res)
          this.$refs.singleView.singleTableData.total = res.total
          let data = formatIndex(res.rows, this.pagination.current, this.pagination.offset)
          let idlist = data.map(p => p.id)
          return { idlist, data }
        })
        .then(data => {
          axiosDict['warehouse']
            .post(`StockAttribute/GetStockNumList`, {
              idlist: data.idlist.toString(),
              whid: this.$refs.singleView.queryCondition.whid.value,
            })
            .then(res => {
              console.log(res, data.data)
              data.data.forEach(p => {
                p.stockKeepingUnit = res.find(f => f.id == p.id).stockKeepingUnit
                p.safetyStock = res.find(f => f.id == p.id).safetyStock
                p.num = res.find(f => f.id == p.id).num
                p.description = res.find(f => f.id == p.id).description
              })
              console.log('combineData', data.data)
              this.$refs.singleView.singleTableData.data = JSON.parse(JSON.stringify(data.data))
            })
        })
    },
  },
})
