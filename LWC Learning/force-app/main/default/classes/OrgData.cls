public with sharing class OrgData {
    @AuraEnabled
    public static string createRecord(Contact con){
        try {
            if(con.LastName != NULL)
            {
                insert con;
                return 'success';
            }
            return 'No data';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<Contact> getData()
     {
        try{
            return [Select Id, LastName, Phone, Email from Contact where LastName<> NULL AND Phone <> NULL AND Email<> NULL LIMIT 10];
        }
         catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void updateRecord(SObject obj){
        try {
            update obj;
        }
            catch (Exception e) {
                System.debug('exception'+e);
            }
        }
    @AuraEnabled
    public static void updateListRecord(List<SObject> recordList){
        try {
            update recordList;
        }
            catch (Exception e) {
                System.debug('exception'+e);
            }
        }

    @AuraEnabled
    public static Void DeleteRecord(String recordId){
        try {
            delete (new contact(Id=recordId));
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    } 

    @AuraEnabled
    public static List<sObject> getDynamicVals(String query){
        System.debug(query);
        try {
            if(query.length()!=0)
            {
                return Database.query(query);
            }
            else {
                throw new AuraHandledException('Query Is Null:'+query);
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Map<String, List<String>> getObjectLabels()
    {
        try{  
			Map < string, List<String> > SObjectMap = new Map <String, List<String> > ();
            for (Schema.SObjectType objTyp: Schema.getGlobalDescribe().Values())
            {
            if (objTyp.getDescribe().isAccessible() && objTyp.getDescribe().isUpdateable() && objTyp.getDescribe().isCreateable())
                {
                    String name = objTyp.getDescribe().getName();
                    if (!name.containsignorecase('history') 	&& !name.containsignorecase('tag') 		 &&
                        !name.containsignorecase('share') 		&& !name.containsignorecase('feed')      &&
                        !name.containsignorecase('__k') 		&& !name.containsignorecase('Event')     &&
                        !name.containsignorecase('knowledge')	&& !name.containsignorecase('Log')  	 &&
                        !name.containsignorecase('Slot') 		&& !name.containsignorecase('Method')    &&
                        !name.containsignorecase('Adjustment')  && !name.containsignorecase('Error'))
                        {
                        SobjectMap.put(objTyp.getDescribe().getName(),(new List<String>{objTyp.getDescribe().getName(), objTyp.getDescribe().getLabel()}));
                        //System.debug(objTyp.getDescribe().getLabel()+' -> '+objTyp.getDescribe().getName());
                        }
                }
            }
            return SobjectMap;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Map<String,String> getFieldType(String objectApiName, List<String> fieldList)
    {//This methord is for getting field type using the field name and object name.
        Map<String,String> fieldTypeMap = new Map<String,String>();
        Schema.DescribeSObjectResult token = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        for (String fieldName : fieldList) {

            fieldTypeMap.put(fieldName, ''+ token.fields.getMap().get(fieldName).getDescribe().getType());
        }
       return fieldTypeMap;
    }


@AuraEnabled
    public static List<FieldSetField> getFieldSet(String objectApiName, String fieldSetName)
    {
        // List<Schema.FieldSetMember> fieldSetMembers = ((SObject)Type.forName(objectApiName).newInstance()).getSObjectType().getDescribe().FieldSets.getMap().get(fieldSetName).getFields();
        // Equal to: 
        List<Schema.FieldSetMember> fieldSetMembers = Schema.getGlobalDescribe().get(objectApiName).getDescribe().FieldSets.getMap().get(fieldSetName).getFields();
        System.debug(objectApiName+'<----->'+fieldSetName);
        List<FieldSetField> fields = new List<FieldSetField>();

        for (Schema.FieldSetMember fieldSetMember : fieldSetMembers)
        {
            FieldSetField fieldSetField = new FieldSetField(fieldSetMember);
            fields.add(fieldSetField);
        }
        System.debug('The output fields is:'+fields);
        return fields;
    }

}