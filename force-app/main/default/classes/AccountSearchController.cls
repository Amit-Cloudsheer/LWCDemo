public with sharing class AccountSearchController {
    @AuraEnabled(Cacheable = true)
    public static List<Account> retriveAccounts(String strAccountName) {
        strAccountName = '%' + strAccountName + '%';
        List<Account> lstAcc = [SELECT  Id, Name, AnnualRevenue FROM Account WHERE Name LIKE :strAccountName];
        return lstAcc; 
    }
}