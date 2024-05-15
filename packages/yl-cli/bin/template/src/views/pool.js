import fetch from '@public/http/request'
import qs from 'qs'
const { GATEWAY } = $ylConfig.http
/*
 * 基础数据平台
 */
export const CommonData = {
  getSysArea() {
    return `${GATEWAY.BAS}/sysArea/list` // 所属区域
  },
  getDefaultCountry() {
    return fetch.get(`${GATEWAY.BAS}/sysCountry/getDefaultCountry`).then(res => res) // 获取默认国家
  },
  /**
     * 获取机构级别
     * @bug 没加权限
     */
  getSysDeptLevel() {
    return fetch.get(`${GATEWAY.BAS}/sysDeptLevel/select?level=0`).then(res => res)
  },
  /**
     * 获取财务中心列表
     * @bug 没加权限
     */
  getFinances() {
    return fetch.get(`${GATEWAY.BAS}/network/getFinances`).then(res => res)
  },
  /**
     * 本币币别列表
     */
  getCurrentType() {
    return fetch.get(`${GATEWAY.BAS}/sysCurrencyType/findSysCurrentTypeComboBoxList`).then(res => res)
  },
  /**
     * 结算目的地
     */
  getDestination(query) {
    return fetch.get(`${GATEWAY.BAS}/settlementDestination/page?name=${query}`).then(res => res)
  },
  /**
     * 大区所有
     */
  getRegional(query) {
    return fetch.get(`${GATEWAY.BAS}/sysRegionalInfo/dropPullList`).then(res => res)
  },
  /**
     * 片区所有
     */
  getArea(query) {
    return fetch.get(`${GATEWAY.BAS}/sysAreaInfo/findSysAreaInfoList?regionalId=${query}`).then(res => res)
  },
  /**
    * 员工
    * @param {*} reqData
    * @void 2019年8月22日 14:01:46 替换为this.$selectApi.reqStaff
    */
  getStaffByNameAndNetwork(reqData) {
    return fetch.get(`${GATEWAY.BAS}/sysStaff/getStaffByNameAndNetwork?` + qs.stringify(reqData)).then(res => res)
  },
  /**
            * 分页获取业务员（员工）
            * isReceive true string 是否收派范围:1是,2否
             networkId true string 网点ID
            * @param {*} reqData
            */
  getSysStaff(reqData) {
    return fetch.get(`${GATEWAY.BAS}/sysStaff/select?` + qs.stringify(reqData)).then(res => res)
  },
  /**
     * 联想搜索用户所在网点之下的所要子网点
     * @param {*} key
     */
  getNetworkPages(reqData) {
    //  @test
    return fetch.get(`${GATEWAY.BAS}/network/getNetworkPages?` + qs.stringify(reqData)).then(res => res)
  },
  /**
     * 联想搜索用户搜索的部门
     * @param {*} key
     * @void 2019年8月22日 14:22:21 this.$selectUrl.department this.$selectApi.reqDepartment
     */
  getDepartmentPages(key) {
    return fetch.get(`${GATEWAY.BAS}/sysDepartmentInfo/pullDownPage?name=` + key.name + `&deptLevelId=` + key.deptLevelId + `&code=` + key.code + `&countryCode=` + key.countryCode).then(res => res)
  },
  /**
     * 通过部门获取部门下面的岗位
     * @param {*} key
     * @void 2019年8月22日 15:08:43 this.$selectApi.reqPost
     */
  getPostByDepartment(key) {
    return fetch.get(`${GATEWAY.BAS}/sysPost/select?departmentId=` + key.departmentId + `&name=` + key.name).then(res => res)
  },

  /**
     * 获取结算方式
     * @param {*} key
     */
  getPaymentManner(reqData) {
    return fetch.get(`${GATEWAY.BAS}/sysPaymentManner/page?` + qs.stringify(reqData)).then(res => res)
  }
}
