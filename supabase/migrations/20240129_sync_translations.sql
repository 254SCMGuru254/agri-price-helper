-- Insert sync-related translations
insert into translations (key, translations) values
('sync.title', '{
  "en": "Data Synchronization",
  "sw": "Usawazishaji wa Data",
  "luo": "Riwruok Data",
  "kam": "Synchronization ya Data",
  "kik": "Kũigananĩria Data",
  "mer": "Usawazishaji wa Data",
  "kal": "Tertet ab Data"
}'::jsonb),

('sync.description', '{
  "en": "Manage your offline data and synchronization settings",
  "sw": "Dhibiti data yako ya nje ya mtandao na mipangilio ya usawazishaji",
  "luo": "Rit data mari ma offline kod setting mag riwruok",
  "kam": "Control data yaku ya offline na settings sya synchronization",
  "kik": "Rũgamĩrĩra data yaku ya offline na mĩbango ya kũigananĩria",
  "mer": "Simamia data yako ya offline na mpangilio wa usawazishaji",
  "kal": "Rib data nebo offline ak settings ab tertet"
}'::jsonb),

('sync.online', '{
  "en": "Online",
  "sw": "Mtandaoni",
  "luo": "Online",
  "kam": "Online",
  "kik": "Online",
  "mer": "Mtandaoni",
  "kal": "Online"
}'::jsonb),

('sync.offline', '{
  "en": "Offline",
  "sw": "Nje ya Mtandao",
  "luo": "Offline",
  "kam": "Offline",
  "kik": "Offline",
  "mer": "Nje ya Mtandao",
  "kal": "Offline"
}'::jsonb),

('sync.pendingItems', '{
  "en": "{count} items pending sync",
  "sw": "Vipengee {count} vinasubiri kusawazishwa",
  "luo": "Gik {count} orito riwruok",
  "kam": "Items {count} syendaa sync",
  "kik": "Indo {count} cieteririe kũigananĩria",
  "mer": "Vipengee {count} vinasubiri kusawazishwa",
  "kal": "Tuwondab {count} bo moche tertet"
}'::jsonb),

('sync.lastSync', '{
  "en": "Last synced",
  "sw": "Ilisawazishwa mwisho",
  "luo": "Ne oriwore mogik",
  "kam": "Last sync",
  "kik": "Kũigananĩria kwa mũthia",
  "mer": "Usawazishaji wa mwisho",
  "kal": "Tertet ne bo let"
}'::jsonb),

('sync.syncNow', '{
  "en": "Sync Now",
  "sw": "Sawazisha Sasa",
  "luo": "Riw Sani",
  "kam": "Sync Riu",
  "kik": "Igananĩria Rĩu",
  "mer": "Sawazisha Sasa",
  "kal": "Tertet Nguni"
}'::jsonb),

('sync.syncing', '{
  "en": "Syncing... {progress}%",
  "sw": "Inasawazisha... {progress}%",
  "luo": "Riwruok... {progress}%",
  "kam": "Syncing... {progress}%",
  "kik": "Kũigananĩria... {progress}%",
  "mer": "Inasawazisha... {progress}%",
  "kal": "Tertet... {progress}%"
}'::jsonb),

('sync.success', '{
  "en": "Sync Complete",
  "sw": "Usawazishaji Umekamilika",
  "luo": "Riwruok Orumo",
  "kam": "Sync Niyailite",
  "kik": "Kũigananĩria Kwathira",
  "mer": "Usawazishaji Umekamilika",
  "kal": "Tertet Kochoget"
}'::jsonb),

('sync.successMessage', '{
  "en": "All your data has been synchronized successfully",
  "sw": "Data yako yote imesawazishwa kwa mafanikio",
  "luo": "Data mari duto oriwore maber",
  "kam": "Data yaku yonthe nisynchronize nesa",
  "kik": "Data yaku yothe nĩyaigananĩirio wega",
  "mer": "Data yako yote imesawazishwa vizuri",
  "kal": "Data neng kokochoget tertet komie"
}'::jsonb),

('sync.error', '{
  "en": "Sync Failed",
  "sw": "Usawazishaji Umeshindwa",
  "luo": "Riwruok Orembi",
  "kam": "Sync Niyanangika",
  "kik": "Kũigananĩria Kwaga",
  "mer": "Usawazishaji Umeshindwa",
  "kal": "Tertet Menngechi"
}'::jsonb),

('sync.errorMessage', '{
  "en": "There was an error synchronizing your data. Please try again",
  "sw": "Kulikuwa na hitilafu kusawazisha data yako. Tafadhali jaribu tena",
  "luo": "Ne nitie rach e riwruok data mari. Tem kendo",
  "kam": "Kwina error synchronizing data yaku. Please try again",
  "kik": "Nĩ kwagĩrĩ na thĩna gũigananĩria data yaku. Geria rĩngĩ",
  "mer": "Kulikuwa na shida kusawazisha data yako. Tafadhali jaribu tena",
  "kal": "Mi teputiet ab tertet data nebo. Saaen kosir"
}'::jsonb),

('sync.failedItems', '{
  "en": "{count} items failed to sync",
  "sw": "Vipengee {count} vimeshindwa kusawazishwa",
  "luo": "Gik {count} orembi riwruok",
  "kam": "Items {count} syaanangika sync",
  "kik": "Indo {count} ciagĩte kũigananĩria",
  "mer": "Vipengee {count} vimeshindwa kusawazishwa",
  "kal": "Tuwondab {count} menngechi tertet"
}'::jsonb),

('sync.retryMessage', '{
  "en": "These items will be retried during the next sync",
  "sw": "Vipengee hivi vitajaribiwa tena wakati wa usawazishaji ujao",
  "luo": "Gigi ibiro tem kendo e riwruok machielo",
  "kam": "Ii items syikasync next time",
  "kik": "Indo ici igeriwo rĩngĩ hĩndĩ ya kũigananĩria kũrũmĩrĩra",
  "mer": "Vipengee hivi vitajaribiwa tena wakati wa usawazishaji ujao",
  "kal": "Tuwondab che kiyai tertet nebo letu"
}'::jsonb),

('sync.autoSync', '{
  "en": "Auto-sync when online",
  "sw": "Sawazisha kiotomatiki ukiwa mtandaoni",
  "luo": "Auto-riw ka online",
  "kam": "Auto-sync yila wi online",
  "kik": "Kũigananĩria-tũhũ rĩrĩa ũrĩ online",
  "mer": "Sawazisha kiotomatiki ukiwa mtandaoni",
  "kal": "Auto-tertet ye online"
}'::jsonb),

('sync.autoSyncEnabled', '{
  "en": "Auto-sync enabled",
  "sw": "Usawazishaji otomatiki umewashwa",
  "luo": "Auto-riw oyawore",
  "kam": "Auto-sync niyavwika",
  "kik": "Kũigananĩria-tũhũ nĩ kwahota",
  "mer": "Usawazishaji otomatiki umewashwa",
  "kal": "Auto-tertet kochoget"
}'::jsonb); 