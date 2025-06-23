-- Insert report-related translations
insert into translations (key, translations) values
('report.button', '{
  "en": "Report",
  "sw": "Ripoti",
  "luo": "Kel",
  "kam": "Report",
  "kik": "Ranga",
  "mer": "Ripoti",
  "kal": "Goita"
}'::jsonb),

('report.title', '{
  "en": "Report Content",
  "sw": "Ripoti Maudhui",
  "luo": "Kel Wach",
  "kam": "Report Content",
  "kik": "Ranga Ũhoro",
  "mer": "Ripoti Maudhui",
  "kal": "Goita Ng''alek"
}'::jsonb),

('report.reasonLabel', '{
  "en": "Why are you reporting this?",
  "sw": "Kwa nini unaripoti hii?",
  "luo": "Ang''o omiyo ikelo ma?",
  "kam": "Niki ukureport ii?",
  "kik": "Nĩ kĩ gĩtũmi kĩa kũranga ũũ?",
  "mer": "Kwa nini unaripoti hii?",
  "kal": "Amunet ne igoitoi?"
}'::jsonb),

('report.reasons.inappropriate', '{
  "en": "Inappropriate content",
  "sw": "Maudhui yasiyofaa",
  "luo": "Wach marach",
  "kam": "Content itaendaa",
  "kik": "Ũhoro ũtaagĩrĩire",
  "mer": "Maudhui yasiyofaa",
  "kal": "Ng''alek che ma kararan"
}'::jsonb),

('report.reasons.spam', '{
  "en": "Spam or misleading",
  "sw": "Taka au udanganyifu",
  "luo": "Spam kata wuond",
  "kam": "Spam kana misleading",
  "kik": "Marũrũ kana maheenania",
  "mer": "Taka au udanganyifu",
  "kal": "Spam anan ng''alek che imanit"
}'::jsonb),

('report.reasons.misleading', '{
  "en": "False or incorrect information",
  "sw": "Taarifa za uwongo au zisizo sahihi",
  "luo": "Wach manono kata marach",
  "kam": "Information ya uwongo kana itaendaa",
  "kik": "Ũhoro wa maheeni kana ũtarĩ wa ma",
  "mer": "Taarifa za uwongo au zisizo sahihi",
  "kal": "Ng''alek che ma bo iman"
}'::jsonb),

('report.reasons.offensive', '{
  "en": "Offensive or harmful",
  "sw": "Ya kuchukiza au ya kudhuru",
  "luo": "Rach kata hiny",
  "kam": "Offensive kana harmful",
  "kik": "Ĩra thũũro kana ĩraganu",
  "mer": "Ya kuchukiza au ya kudhuru",
  "kal": "Ng''alek che ya anan che nyalil"
}'::jsonb),

('report.reasons.other', '{
  "en": "Other reason",
  "sw": "Sababu nyingine",
  "luo": "Rach machielo",
  "kam": "Reason ingi",
  "kik": "Gĩtũmi kĩngĩ",
  "mer": "Sababu nyingine",
  "kal": "Amunet alak"
}'::jsonb),

('report.customReasonLabel', '{
  "en": "Please explain your reason",
  "sw": "Tafadhali eleza sababu yako",
  "luo": "Yie ilerni gima omiyo",
  "kam": "Please explain reason yaku",
  "kik": "Ndagũthaitha guũrĩra gĩtũmi gĩaku",
  "mer": "Tafadhali eleza sababu yako",
  "kal": "Aleweni amunet nebo"
}'::jsonb),

('report.customReasonPlaceholder', '{
  "en": "Provide details about why you are reporting this content...",
  "sw": "Toa maelezo kuhusu kwa nini unaripoti maudhui haya...",
  "luo": "Chiw weche malero ang''o omiyo ikelo wachni...",
  "kam": "Nenga details sya niki ukureport ii content...",
  "kik": "Heana ũhoro wa gĩtũmi kĩa gũkũringĩrĩria kũranga ũhoro ũyũ...",
  "mer": "Toa maelezo kuhusu kwa nini unaripoti maudhui haya...",
  "kal": "Konech tetet ab amunet ne igoitoi ng''alek chu..."
}'::jsonb),

('report.submit', '{
  "en": "Submit Report",
  "sw": "Tuma Ripoti",
  "luo": "Or Ripot",
  "kam": "Submit Report",
  "kik": "Tũma Mũrigo",
  "mer": "Tuma Ripoti",
  "kal": "Ibwat Logoiywet"
}'::jsonb),

('report.submitting', '{
  "en": "Submitting...",
  "sw": "Inatuma...",
  "luo": "Ioro...",
  "kam": "Yukutuma...",
  "kik": "Nĩkũratũma...",
  "mer": "Inatuma...",
  "kal": "Ibwotei..."
}'::jsonb),

('report.success', '{
  "en": "Report Submitted",
  "sw": "Ripoti Imetumwa",
  "luo": "Ripot Oor",
  "kam": "Report Yatumwa",
  "kik": "Mũrigo Nĩwatũmwo",
  "mer": "Ripoti Imetumwa",
  "kal": "Kiibwat Logoiywet"
}'::jsonb),

('report.successMessage', '{
  "en": "Thank you for your report. We will review it shortly.",
  "sw": "Asante kwa ripoti yako. Tutaipitia hivi karibuni.",
  "luo": "Erokamano kuom ripot mari. Wabiro nono mapiyo.",
  "kam": "Thank you kwa report yaku. Tukaicheck vau.",
  "kik": "Nĩtwakũshukuru nĩ ũndũ wa mũrigo waku. Nĩtũkawĩrora narua.",
  "mer": "Asante kwa ripoti yako. Tutaipitia hivi karibuni.",
  "kal": "Kongoi ak logoiyweng''ung''. Kibesir ng''atet."
}'::jsonb),

('report.error', '{
  "en": "Report Failed",
  "sw": "Ripoti Imeshindwa",
  "luo": "Ripot Ok Oor",
  "kam": "Report Yanangika",
  "kik": "Mũrigo Ndwahota",
  "mer": "Ripoti Imeshindwa",
  "kal": "Menngechi Logoiywet"
}'::jsonb),

('report.reasonRequired', '{
  "en": "Reason Required",
  "sw": "Sababu Inahitajika",
  "luo": "Rach Dwarore",
  "kam": "Reason Yendekaa",
  "kik": "Gĩtũmi Nĩkĩbataire",
  "mer": "Sababu Inahitajika",
  "kal": "Moche Amunet"
}'::jsonb),

('report.reasonRequiredMessage', '{
  "en": "Please select a reason for your report",
  "sw": "Tafadhali chagua sababu ya ripoti yako",
  "luo": "Yie iyier rach mar ripot mari",
  "kam": "Please select reason ya report yaku",
  "kik": "Ndagũthaitha ũthure gĩtũmi kĩa mũrigo waku",
  "mer": "Tafadhali chagua sababu ya ripoti yako",
  "kal": "Iyeng''e amunet ab logoiyweng''ung''"
}'::jsonb),

('report.customReasonRequired', '{
  "en": "Please provide details for your custom reason",
  "sw": "Tafadhali toa maelezo ya sababu yako",
  "luo": "Yie ichiw weche malero rach mari",
  "kam": "Please nenga details sya reason yaku",
  "kik": "Ndagũthaitha ũheane ũhoro wa gĩtũmi gĩaku",
  "mer": "Tafadhali toa maelezo ya sababu yako",
  "kal": "Konech tetet ab amunet nebo"
}'::jsonb); 