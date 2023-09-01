public class LookupController {
    @AuraEnabled
    Public static List<sObject> lookup(String objectType, String searchText, String searchAgainst, String secondaryField, Integer maxResults){
        // objectType : Object for which we need to search for 
        // searchText : text that we need to search for
        // searchAgainst : Field in which we need to search the text (Expected fields types are String, Picklist or Email or any other field which can be filtered using the like opertaor.)
        // secondaryField : Field that will be used as a meta field on the lookup results, this is an optional field.
        List<sObject> results = new List<sObject>();
        
        
        if(String.isNotBlank(searchText) && searchText.length() > 1){
            
            //Build the query for the object.
            String Query = 'Select id, Name';

            // Add the searchAgainst field in the query, if field is not available use Name as the default field.
            if(String.isBlank(searchAgainst)){
                searchAgainst = 'Name';
            }else if(searchAgainst != 'Name'){
                Query += ','+searchAgainst;
            }

            // Add the secondaryField field in the query.
            if(String.isNotBlank(secondaryField) && secondaryField != searchAgainst){
                Query += ','+secondaryField;
            }
            Query += ' from '+objectType+' where '+searchAgainst+' Like \''+searchText+'%\' Limit '+maxResults;


            
            for(sObject obj : Database.Query(Query)){
                results.add(obj);
            }

        }

        return results;
    }

    // leaving this method in case someone needs to validate the field names and object names as well.
    // Not doing it myself because i am expecting that anyone who passes the data to this component knows what he is doing and which fields he needs to use.
    @AuraEnabled
    public static Boolean isDataValid(String objectName, String searchAgainst, String secondaryField ){
        Map<String, Schema.SObjectType> AllObjects = Schema.getGlobalDescribe(); 

        if(AllObjects.containsKey(objectName)){
            Map<String, Schema.sObjectField> allFieldMap = AllObjects.get(objectName).getDescribe().fields.getMap();

            if(String.isNotBlank(searchAgainst) && !allFieldMap.containsKey(searchAgainst)){
                throw new auraException('Please select a valid field to search against for the lookup.');
            }else if(String.isNotBlank(searchAgainst)){
                Schema.DisplayType fieldType = allFieldMap.get(searchAgainst).getDescribe().getType();

                if(fieldType != Schema.DisplayType.String && fieldType != Schema.DisplayType.Email && fieldType != Schema.DisplayType.Picklist){
                   throw new auraException('Field to search against should be of Text, Email or Picklist type only.');
                }
            }


            if(String.isNotBlank(secondaryField) && !allFieldMap.containsKey(secondaryField)){
                throw new auraException('Please select a valid secondaryField for the lookup.');
            }

        }else{
            throw new auraException('Please select a valid object for the lookup.');
        }


        return true;
    }
}