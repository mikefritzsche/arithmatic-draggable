export type Id = string
export interface ObjectAttribute {
  id: Id
  name: string
  label: string
  data_type: string
  values: any
  is_multi_select: boolean
  master_detail: boolean
  name_field: string | null
  is_external_attribute: boolean
  object_class_id: string
  reference_to: any
  required: boolean
  updateable: boolean
  object_attribute_group_id: string
  external_service_id: string
  is_calculated: boolean
  in_dependency: boolean
  is_catalyst_cf: boolean
  is_team_member: boolean
  object_attribute_id: string
  deletable: boolean
  local_attribute: string
  local_entity: boolean
  mappable: boolean
  description: string | null
  local_label: string
  object_attribute_mapping_id: string

}

export const objectAttributes = [
  {
    "id": "003cde4d-133d-41f5-9c8f-4a47e26c1be6",
    "name": "lead",
    "label": "Lead",
    "data_type": "catalyst_entity_reference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": null,
    "is_external_attribute": false,
    "object_class_id": "e505624b-1310-4c9b-909d-e21c54781800",
    "reference_to": [
      "07b376cf-aedb-4a48-97c9-4bc7424229bc"
    ],
    "required": true,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "0c113205-8c51-4920-aceb-140126c33e06",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "93c9318f-4ce8-4dbb-8f23-ab949ce18e36",
    "deletable": false,
    "local_attribute": "Lead",
    "local_entity": true,
    "mappable": false,
    "description": null,
    "local_label": "Lead",
    "object_attribute_mapping_id": "003cde4d-133d-41f5-9c8f-4a47e26c1be6"
  },
  {
    "id": "0140a1ce-ffb9-47f8-85df-7cc8d6503fd4",
    "name": "LastModifiedById",
    "label": "Last Modified By ID",
    "data_type": "reference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": true,
    "object_class_id": "394bd194-1734-420d-bb21-e06b4ae9e9a3",
    "reference_to": [
      "1d6f7565-8fb4-43a3-b689-5a5d8c6ded8c"
    ],
    "required": true,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "9db87773-21ae-44f9-b4b6-6aa6ded1def9",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "49ae1727-85ee-4203-a1f2-5d77a3220745",
    "deletable": true,
    "local_attribute": "Last Modified By ID",
    "local_entity": false,
    "mappable": true,
    "description": null,
    "local_label": "Last Modified By ID",
    "object_attribute_mapping_id": "0140a1ce-ffb9-47f8-85df-7cc8d6503fd4"
  },
  {
    "id": "0172695a-e2a7-489f-80e2-546dfdb9b51f",
    "name": "__catalyst__team_member_Sales Rep",
    "label": "Team Member Sales Rep",
    "data_type": "reference",
    "values": [],
    "is_multi_select": true,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "5c3b0dab-125f-481c-99ce-2aef1f5e0e2d",
    "reference_to": [
      "1d6f7565-8fb4-43a3-b689-5a5d8c6ded8c"
    ],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": "7832da0c-e386-4543-b51b-9bb5cb62d37f",
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": true,
    "object_attribute_id": "ab843f61-e4f6-4463-9adc-ff66b04fd6aa",
    "deletable": true,
    "local_attribute": "Team Member Sales Rep",
    "local_entity": false,
    "mappable": false,
    "description": null,
    "local_label": "Team Member Sales Rep",
    "object_attribute_mapping_id": "0172695a-e2a7-489f-80e2-546dfdb9b51f"
  },
  {
    "id": "0207993d-70ff-484a-922d-4caf9f12e42a",
    "name": "__catalyst__team_member_Channel Manager",
    "label": "Team Member Channel Manager",
    "data_type": "reference",
    "values": [],
    "is_multi_select": true,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "5c3b0dab-125f-481c-99ce-2aef1f5e0e2d",
    "reference_to": [
      "1d6f7565-8fb4-43a3-b689-5a5d8c6ded8c"
    ],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": "7832da0c-e386-4543-b51b-9bb5cb62d37f",
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": true,
    "object_attribute_id": "f4f89cb2-ff00-4bec-8f39-3acef25ddeab",
    "deletable": true,
    "local_attribute": "Team Member Channel Manager",
    "local_entity": false,
    "mappable": false,
    "description": null,
    "local_label": "Team Member Channel Manager",
    "object_attribute_mapping_id": "0207993d-70ff-484a-922d-4caf9f12e42a"
  },
  {
    "id": "0228f4da-ac99-4ab0-9deb-52c26e1e917b",
    "name": "__catalyst_im",
    "label": "Im",
    "data_type": "catalystreference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": null,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [
      "users"
    ],
    "required": false,
    "updateable": true,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "22c6a043-9b05-45c7-a197-4069adfb9f9c",
    "deletable": true,
    "local_attribute": "IM",
    "local_entity": false,
    "mappable": true,
    "description": "asdf",
    "local_label": "IM",
    "object_attribute_mapping_id": "0228f4da-ac99-4ab0-9deb-52c26e1e917b"
  },
  {
    "id": "022bebb9-d76f-479b-92eb-08950a3ab82b",
    "name": "Also_Evaluating__c",
    "label": "Also Evaluating",
    "data_type": "multipicklist",
    "values": [
      {
        "type": "picklist_option",
        "id": "22d66425-d016-4976-a458-29df98d348c5",
        "value": "Gainsight",
        "label": "Gainsight",
        "color": "#cfe57e"
      },
      {
        "type": "picklist_option",
        "id": "2f57d99e-5a69-49ee-89d3-1445748f1228",
        "value": "Totango",
        "label": "Totango",
        "color": "#a6e9d8"
      },
      {
        "type": "picklist_option",
        "id": "cd2e0349-e7c6-49cc-9cdc-877f1d0c9c17",
        "value": "ClientSuccess",
        "label": "ClientSuccess",
        "color": "#eb84ca"
      },
      {
        "type": "picklist_option",
        "id": "5638df00-0c8a-43bc-ab8c-a335b9b8d127",
        "value": "Akita",
        "label": "Akita",
        "color": "#f3b300"
      },
      {
        "type": "picklist_option",
        "id": "be5ea01c-9deb-4140-9e1a-da3591bfb552",
        "value": "Natero",
        "label": "Natero",
        "color": "#f7d0eb"
      },
      {
        "type": "picklist_option",
        "id": "106220d3-cf24-4160-b395-0a0fa0267842",
        "value": "Salesmachine",
        "label": "Salesmachine",
        "color": "#c393ea"
      }
    ],
    "is_multi_select": true,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": true,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": true,
    "object_attribute_group_id": null,
    "external_service_id": "9db87773-21ae-44f9-b4b6-6aa6ded1def9",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "524e0228-1d77-4dec-89ca-f37a624a4c8a",
    "deletable": true,
    "local_attribute": "Also Evaluating",
    "local_entity": false,
    "mappable": true,
    "description": "We use this to indicate which products a prospect is evaluating - please update as you receive more info.",
    "local_label": "Also Evaluating",
    "object_attribute_mapping_id": "022bebb9-d76f-479b-92eb-08950a3ab82b"
  },
  {
    "id": "02f05837-0b64-4967-870f-66f93ebd8e18",
    "name": "__catalyst_jdtest2",
    "label": "Jdtest2",
    "data_type": "string",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": null,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": true,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "c6f60d21-ced3-4226-a6a8-3ee8d1227478",
    "deletable": true,
    "local_attribute": "jdtest2",
    "local_entity": false,
    "mappable": true,
    "description": null,
    "local_label": "Jdtest2",
    "object_attribute_mapping_id": "02f05837-0b64-4967-870f-66f93ebd8e18"
  },
  {
    "id": "034cb8e4-9357-4fb4-b2e8-bacaab454f96",
    "name": "__catalyst_lightningtogglemetrics",
    "label": "Lightning Toggle Metrics",
    "data_type": "catalyst_entity_reference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "428f79eb-bc4a-4be7-a470-068b29a9bef8",
    "reference_to": [
      "d252fa60-8d79-45bb-8496-38126a38af95"
    ],
    "required": true,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "0c113205-8c51-4920-aceb-140126c33e06",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "b3aa0dba-15bc-4f1d-bd9a-4206d4966f0e",
    "deletable": false,
    "local_attribute": "Lightning Toggle Metrics",
    "local_entity": true,
    "mappable": false,
    "description": null,
    "local_label": "Lightning Toggle Metrics",
    "object_attribute_mapping_id": "034cb8e4-9357-4fb4-b2e8-bacaab454f96"
  },
  {
    "id": "0479d3d0-61fd-45f1-a1ad-794fde353ebd",
    "name": "Contact_Ref__c",
    "label": "Contact Ref",
    "data_type": "reference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": true,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [
      "04ef05af-91e9-47a2-8cd5-cc746513475d"
    ],
    "required": false,
    "updateable": true,
    "object_attribute_group_id": null,
    "external_service_id": "9db87773-21ae-44f9-b4b6-6aa6ded1def9",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "fc4fb6b8-194f-4472-96d9-35206171a353",
    "deletable": true,
    "local_attribute": "Contact Ref",
    "local_entity": false,
    "mappable": true,
    "description": null,
    "local_label": "Contact Ref",
    "object_attribute_mapping_id": "0479d3d0-61fd-45f1-a1ad-794fde353ebd"
  },
  {
    "id": "047b3f5e-efa4-488c-a1b5-26061abaa3a4",
    "name": "LastModifiedById",
    "label": "Last Modified By ID",
    "data_type": "reference",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": true,
    "object_class_id": "10f72602-e22c-47fb-8f99-5a2b75373833",
    "reference_to": [
      "1d6f7565-8fb4-43a3-b689-5a5d8c6ded8c"
    ],
    "required": true,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "9db87773-21ae-44f9-b4b6-6aa6ded1def9",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": false,
    "is_team_member": false,
    "object_attribute_id": "ada5dbff-0d97-413f-a798-2215d87c3005",
    "deletable": true,
    "local_attribute": "Last Modified By ID1",
    "local_entity": false,
    "mappable": true,
    "description": null,
    "local_label": "Last Modified By ID1",
    "object_attribute_mapping_id": "047b3f5e-efa4-488c-a1b5-26061abaa3a4"
  }
]
export const calculatedFields = [
  {
    "id": "0071a355-5f8c-47fd-8554-254853938f5c",
    "name": "__catalyst_cf_count_of_opportunities_for_account",
    "label": "Count Of Opportunities For Account",
    "data_type": "int",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "count",
      "query": [],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "00ee2371-3497-4960-a290-848a5d7359fc"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "647c1cb3-9a59-4993-acb2-4a4459ee38ab",
    "deletable": true,
    "local_attribute": "Count of Opportunities for Account",
    "local_entity": false,
    "mappable": true,
    "description": "Test this",
    "local_label": "Count of Opportunities for Account",
    "object_attribute_mapping_id": "0071a355-5f8c-47fd-8554-254853938f5c"
  },
  {
    "id": "0543e787-2023-42ea-ac78-22caaf79c871",
    "name": "__catalyst_cf_total_amount_of_open_opps",
    "label": "Total Amount Of Open Opp",
    "data_type": "currency",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "sum",
      "query": [
        {
          "operator": "AND",
          "values": [
            {
              "field_id": "d98ceecf-4863-4e8b-b533-5df3429e5297",
              "value": null,
              "operator": "false",
              "duration": null,
              "duration_type": null,
              "is_coq_query": false
            }
          ]
        }
      ],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "133441c3-effd-4183-8036-06423bed194c"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "fa10a382-9d71-40f0-ba22-a601bbf9db55",
    "deletable": true,
    "local_attribute": "Total Amount Of Open Opp",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Total Amount Of Open Opp",
    "object_attribute_mapping_id": "0543e787-2023-42ea-ac78-22caaf79c871"
  },
  {
    "id": "1490ec4c-9a35-4188-98b7-40ab0aa70dbe",
    "name": "__catalyst_cf_most_recent_birthdate",
    "label": "Most Recent Birthdate",
    "data_type": "date",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "max",
      "query": [
        {
          "operator": "AND",
          "values": [
            {
              "field_id": "d7a70162-2476-4d2b-b073-25bc0c83f9b6",
              "value": null,
              "operator": "present",
              "duration": null,
              "duration_type": null,
              "is_coq_query": false
            }
          ]
        }
      ],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "d7a70162-2476-4d2b-b073-25bc0c83f9b6"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "cf3562e9-383a-4d1d-860d-c381182c85b7",
    "deletable": true,
    "local_attribute": "Most Recent Birthdate",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Most Recent Birthdate",
    "object_attribute_mapping_id": "1490ec4c-9a35-4188-98b7-40ab0aa70dbe"
  },
  {
    "id": "2da78a79-86ec-411f-96c2-bb632af7c8fe",
    "name": "__catalyst_cf_count_of_contacts_with_email_true",
    "label": "Count Of Contacts With Email? True",
    "data_type": "int",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "count",
      "query": [
        {
          "operator": "AND",
          "values": [
            {
              "field_id": "d2abb6e9-623b-41c1-b2ad-b76e55889c00",
              "value": null,
              "operator": "true",
              "duration": null,
              "duration_type": null,
              "is_coq_query": false
            }
          ]
        }
      ],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "026eae80-4427-465a-a3c8-160e9ed86019"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "b895d6ae-3f8e-49ea-a03c-5a6a8a989f31",
    "deletable": true,
    "local_attribute": "Count of Contacts with Email? True",
    "local_entity": false,
    "mappable": true,
    "description": "A very long description describing a calculated field that has a count of contacts that has emails",
    "local_label": "Count of Contacts with Email? True",
    "object_attribute_mapping_id": "2da78a79-86ec-411f-96c2-bb632af7c8fe"
  },
  {
    "id": "35d40bfb-a5af-487a-8803-34fe41179363",
    "name": "__catalyst_cf_days_since_renewal_date",
    "label": "Days Since Renewal Date",
    "data_type": "int",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "days_since",
      "query": [],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "603c8ab2-0923-4f63-8009-4c22c91adb38"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "8bbabfe5-bc2f-4878-be82-c042db3c72e8",
    "deletable": true,
    "local_attribute": "Days Since Renewal Date",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Days Since Renewal Date",
    "object_attribute_mapping_id": "35d40bfb-a5af-487a-8803-34fe41179363"
  },
  {
    "id": "3675b818-4443-4f1a-8c0b-3dcd3a01053b",
    "name": "__catalyst_cf_bee_bopp",
    "label": "Opps With Current Quarter Close Date",
    "data_type": "currency",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "sum",
      "query": [
        {
          "operator": "AND",
          "values": [
            {
              "field_id": "50a45680-b9be-4ef6-a9f2-4ad876f451cb",
              "value": "2021/10/05",
              "operator": "less_than",
              "duration": null,
              "duration_type": null,
              "is_coq_query": false
            }
          ]
        }
      ],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "133441c3-effd-4183-8036-06423bed194c"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "5aee0a71-d143-477a-82b3-26672fd242c3",
    "deletable": true,
    "local_attribute": "Opps with current quarter close date",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Opps with current quarter close date",
    "object_attribute_mapping_id": "3675b818-4443-4f1a-8c0b-3dcd3a01053b"
  },
  {
    "id": "48a55ef8-1da7-44b0-a673-d9b64db75e0a",
    "name": "__catalyst_cf_pct_cf_field",
    "label": "pct cf field",
    "data_type": "percent",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "percent",
      "query": [],
      "operands": [
        {
          "position": 1,
          "value_type": "object_attribute",
          "value": "16893ea5-ff82-41c0-8eca-353e156827aa"
        },
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "0d52efc4-c7a2-4402-b10d-7e5be37bed0a"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "c7814f3a-9074-4c82-82d5-3365642a760f",
    "deletable": true,
    "local_attribute": "pct cf field",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Pct Cf Field",
    "object_attribute_mapping_id": "48a55ef8-1da7-44b0-a673-d9b64db75e0a"
  },
  {
    "id": "4bbdc70a-c606-4128-818e-14867aec7dce",
    "name": "__catalyst_cf_testing_rank_op",
    "label": "Testing Rank op",
    "data_type": "datetime",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "max",
      "query": [
        {
          "operator": "AND",
          "values": [
            {
              "field_id": "db68ebe0-483e-469b-8a69-afdebb2b8f0e",
              "value": null,
              "operator": "present",
              "duration": null,
              "duration_type": null,
              "is_coq_query": false
            }
          ]
        }
      ],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "255e5dc3-e6aa-4f0e-8ba9-36c6d27e3486"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "37ace37f-5785-4ad0-ac0d-1e1128b777ff",
    "deletable": true,
    "local_attribute": "Testing Rank op",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Testing Rank op",
    "object_attribute_mapping_id": "4bbdc70a-c606-4128-818e-14867aec7dce"
  },
  {
    "id": "54be20e3-57ff-422e-a2f0-dfd73385748e",
    "name": "__catalyst_cf_existing_input_ro_test",
    "label": "Existing input RO test",
    "data_type": "int",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 0,
      "max_depth_reached": false,
      "ancestor_cf_ids": [],
      "operation": "days_since",
      "query": [],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "2e46b1c7-b225-41f9-9c0c-de2357a83eba"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "41c8032c-bb7c-49f4-8230-cf758d47b2f9",
    "deletable": true,
    "local_attribute": "Existing input RO test",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Existing input RO test",
    "object_attribute_mapping_id": "54be20e3-57ff-422e-a2f0-dfd73385748e"
  },
  {
    "id": "5545ba68-d824-4564-8972-6ceedf6319f9",
    "name": "__catalyst_cf_average_open_opp_percentage",
    "label": "Average Open Opp Percentage",
    "data_type": "double",
    "values": [],
    "is_multi_select": false,
    "master_detail": false,
    "name_field": false,
    "is_external_attribute": false,
    "object_class_id": "ae907ed3-b6c6-4fdc-a948-0bac811c2c08",
    "reference_to": [],
    "required": false,
    "updateable": false,
    "object_attribute_group_id": null,
    "external_service_id": "048d2fbe-e2b5-494a-9929-72dfccf3353a",
    "is_calculated": false,
    "in_dependency": false,
    "is_catalyst_cf": true,
    "formula": {
      "max_depth": 1,
      "max_depth_reached": false,
      "ancestor_cf_ids": [
        "80a32be9-83f3-4040-bc1d-4bd34f594caa"
      ],
      "operation": "avg",
      "query": [],
      "operands": [
        {
          "position": 0,
          "value_type": "object_attribute",
          "value": "80a32be9-83f3-4040-bc1d-4bd34f594caa"
        }
      ]
    },
    "is_team_member": false,
    "object_attribute_id": "fade8f38-3e99-4d27-99e6-000cdb06263c",
    "deletable": true,
    "local_attribute": "Average Open Opp Percentage",
    "local_entity": false,
    "mappable": true,
    "description": "",
    "local_label": "Average Open Opp Percentage",
    "object_attribute_mapping_id": "5545ba68-d824-4564-8972-6ceedf6319f9"
  }
]

export function objectAttributeLabelById(id: Id, objectAttributes: ObjectAttribute[]) {
  const objectAttribute = [...objectAttributes, ...calculatedFields].find(attribute => {
    console.log(id, attribute.id, id === attribute.id)
    return attribute.id === id
  })

  return objectAttribute?.label
}