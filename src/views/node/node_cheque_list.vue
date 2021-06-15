<template>
  <div>
    <el-table v-if="storeValue.cheque != null" :data="storeValue.cheque.value" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        label="peer"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.peer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="65px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.lastreceived != null">转入</el-tag>
          <el-tag v-if="scope.row.lastsent != null">转出</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="beneficiary">
        <template slot-scope="scope">
          <span v-if="scope.row.lastreceived != null">{{scope.row.beneficiary}}</span>
          <span v-if="scope.row.lastsent != null">{{scope.row.beneficiary}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="chequebook">
        <template slot-scope="scope">
          <span v-if="scope.row.lastreceived != null">{{scope.row.chequebook}}</span>
          <span v-if="scope.row.lastsent != null">{{scope.row.chequebook}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="payout">
        <template slot-scope="scope">
          <span v-if="scope.row.lastreceived != null">{{scope.row.payout}}</span>
          <span v-if="scope.row.lastsent != null">{{scope.row.payout}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" 
              @click="showCashout(scope.row)">提现</el-button>
            <el-button size="small" type="primary" 
              @click="showCashoutResult(scope.row)">查看结果</el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-dialog v-el-drag-dialog :visible.sync="dialogCashoutVisible" title="提现请求设置" >
      <el-form ref="cashoutForm" :rules="rules" :model="cashoutFormData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Gas-Price" prop="gasPrice">
          <el-input v-model="cashoutFormData.gasPrice"/>
          <span style="font-size:11px">单位/GWei</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCashoutVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="cashout()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog :visible.sync="dialogCashoutResultVisible" title="查看结果" >
      <div v-if="cashoutResultData.cashout != null">
        <DescriptionList v-if="cashoutResultData.cashout.error" title="请求结果" col="24" :content="cashoutResultData.cashout">
          <Description term="错误信息">{{ cashoutResultData.cashout.message }}</Description>
        </DescriptionList>
        <DescriptionList v-if="!cashoutResultData.cashout.error" title="请求结果" col="12" :content="cashoutResultData.cashout">
            <Description term="事务hash">{{ cashoutResultData.cashout.transactionHash }}</Description>
        </DescriptionList>
      </div>
      <div v-if="cashoutResultData.cashoutResult != null">
        <DescriptionList v-if="cashoutResultData.cashoutResult.error" title="提现结果" col="24" :content="cashoutResultData.cashoutResult">
          <Description term="错误信息">{{ cashoutResultData.cashoutResult.message }}</Description>
        </DescriptionList>
        
        <DescriptionList v-if="!cashoutResultData.cashoutResult.error" title="提现结果" col="12" :content="cashoutResultData.cashoutResult">

            <Description term="事务hash">{{ cashoutResultData.cashoutResult.transactionHash }}</Description>
            <Description term="余额">{{ cashoutResultData.cashoutResult.uncashedAmount }}</Description>

            <Description term="beneficiary">{{ cashoutResultData.cashoutResult.lastCashedCheque.beneficiary }}</Description>
            <Description term="chequebook">{{ cashoutResultData.cashoutResult.lastCashedCheque.chequebook }}</Description>
            <Description term="payout">{{ cashoutResultData.cashoutResult.lastCashedCheque.payout}}</Description>

            <Description term="recipient">{{ cashoutResultData.cashoutResult.result.recipient }}</Description>
            <Description term="lastPayout">{{ cashoutResultData.cashoutResult.result.lastPayout }}</Description>
            <Description term="bounced">{{ cashoutResultData.cashoutResult.result.bounced }}</Description>

        </DescriptionList>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { submitCashout, getCashoutResult } from '@/api/node'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import DescriptionList from '@/views/node/description_list'
export default {
  components: {DescriptionList},
  directives: {elDragDialog},
  filters: {
  },
  props: {
    storeValue: {
      type: Object
    },
    nodeInfo: {
      type: Object
    }
  },
  data() {
    return {
      cashoutFormData: {
        gasPrice: ''
      },
      cashoutResultData: {
        cashout: null,
        cashoutResult: null
      },
      rules: {},
      dialogCashoutVisible: false,
      dialogCashoutResultVisible: false
    }
  },
  created() {
    
  },
  methods: {
    showCashout(row) {
      this.cashoutFormData.peer = row.peer
      this.dialogCashoutVisible = true
    },
    cashout() {
      submitCashout(this.nodeInfo.id, this.cashoutFormData.peer, this.cashoutFormData.gasPrice).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    },
    showCashoutResult(row) {
      this.cashoutResultData.peer = row.peer
      this.refreshCashoutResult()
      this.dialogCashoutResultVisible = true
    },
    refreshCashoutResult() {
      getCashoutResult(this.nodeInfo.id, this.cashoutResultData.peer).then(res => {
          if (res.result.isOffline) {
            this.$message({
              message: '节点不在线，无法获取最新数据',
              type: 'warn'
            })
          }
          this.cashoutResultData.cashout = res.result.cashout
          this.cashoutResultData.cashoutResult = res.result.cashoutResult
      })
    }
  }
}
</script>

