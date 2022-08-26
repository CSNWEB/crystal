select __single_table_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items__."type"::text as "0",
    __single_table_items__."parent_id"::text as "1",
    __single_table_items__."id"::text as "2",
    __single_table_items_identifiers__.idx as "3"
  from interfaces_and_unions.single_table_items as __single_table_items__
  where
    (
      true /* authorization checks */
    ) and (
      __single_table_items__."id" = __single_table_items_identifiers__."id0"
    )
  order by __single_table_items__."id" asc
) as __single_table_items_result__

select __single_table_items_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __single_table_items_identifiers__,
lateral (
  select
    __single_table_items__."type"::text as "0",
    __single_table_items__."author_id"::text as "1",
    __single_table_items_identifiers__.idx as "2"
  from interfaces_and_unions.single_table_items as __single_table_items__
  where
    (
      true /* authorization checks */
    ) and (
      __single_table_items__."id" = __single_table_items_identifiers__."id0"
    )
  order by __single_table_items__."id" asc
) as __single_table_items_result__

select __people_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0"
  from json_array_elements($1::json) with ordinality as ids
) as __people_identifiers__,
lateral (
  select
    __people__."username" as "0",
    __people_identifiers__.idx as "1"
  from interfaces_and_unions.people as __people__
  where
    (
      true /* authorization checks */
    ) and (
      __people__."person_id" = __people_identifiers__."id0"
    )
  order by __people__."person_id" asc
) as __people_result__