-- Insert moderation-related translations
insert into translations (key, translations) values
('moderation.title', '{
  "en": "Community Moderation",
  "sw": "Usimamizi wa Jamii",
  "luo": "Rito mar Oganda",
  "kam": "Control ya Community",
  "kik": "Ũtongoria wa Kĩrĩndĩ",
  "mer": "Usimamizi wa Jamii",
  "kal": "Ribet ab Kokwet"
}'::jsonb),

('moderation.description', '{
  "en": "Review and manage reported content",
  "sw": "Kagua na simamia maudhui yaliyoripotiwa",
  "luo": "Non kendo rit weche mosekel",
  "kam": "Review na control content ila yareported",
  "kik": "Rora na ũtongorie ũhoro ũrĩa ũrangĩrĩirwo",
  "mer": "Kagua na simamia maudhui yaliyoripotiwa",
  "kal": "Sir ak rib ng''alek che kigoito"
}'::jsonb),

('moderation.allReports', '{
  "en": "All Reports",
  "sw": "Ripoti Zote",
  "luo": "Ripot Duto",
  "kam": "Reports Syonthe",
  "kik": "Mĩrigo Yothe",
  "mer": "Ripoti Zote",
  "kal": "Logoiywek Tugul"
}'::jsonb),

('moderation.priceReports', '{
  "en": "Price Reports",
  "sw": "Ripoti za Bei",
  "luo": "Ripot mag Bei",
  "kam": "Reports sya Prices",
  "kik": "Mĩrigo ya Thogora",
  "mer": "Ripoti za Bei",
  "kal": "Logoiywek ab Oret"
}'::jsonb),

('moderation.communityReports', '{
  "en": "Community Reports",
  "sw": "Ripoti za Jamii",
  "luo": "Ripot mag Oganda",
  "kam": "Reports sya Community",
  "kik": "Mĩrigo ya Kĩrĩndĩ",
  "mer": "Ripoti za Jamii",
  "kal": "Logoiywek ab Kokwet"
}'::jsonb),

('moderation.businessReports', '{
  "en": "Business Reports",
  "sw": "Ripoti za Biashara",
  "luo": "Ripot mag Ohala",
  "kam": "Reports sya Business",
  "kik": "Mĩrigo ya Wonjoria",
  "mer": "Ripoti za Biashara",
  "kal": "Logoiywek ab Biashara"
}'::jsonb),

('moderation.noReports', '{
  "en": "No reports to review",
  "sw": "Hakuna ripoti za kukagua",
  "luo": "Onge ripot mondo ine",
  "kam": "Vatho reports ya kureview",
  "kik": "Hatirĩ mĩrigo ya kũrora",
  "mer": "Hakuna ripoti za kukagua",
  "kal": "Mami logoiywek che kigoito"
}'::jsonb),

('moderation.noPriceReports', '{
  "en": "No price reports to review",
  "sw": "Hakuna ripoti za bei za kukagua",
  "luo": "Onge ripot mag bei mondo ine",
  "kam": "Vatho reports sya prices ya kureview",
  "kik": "Hatirĩ mĩrigo ya thogora ya kũrora",
  "mer": "Hakuna ripoti za bei za kukagua",
  "kal": "Mami logoiywek ab oret che kigoito"
}'::jsonb),

('moderation.noCommunityReports', '{
  "en": "No community reports to review",
  "sw": "Hakuna ripoti za jamii za kukagua",
  "luo": "Onge ripot mag oganda mondo ine",
  "kam": "Vatho reports sya community ya kureview",
  "kik": "Hatirĩ mĩrigo ya kĩrĩndĩ ya kũrora",
  "mer": "Hakuna ripoti za jamii za kukagua",
  "kal": "Mami logoiywek ab kokwet che kigoito"
}'::jsonb),

('moderation.noBusinessReports', '{
  "en": "No business reports to review",
  "sw": "Hakuna ripoti za biashara za kukagua",
  "luo": "Onge ripot mag ohala mondo ine",
  "kam": "Vatho reports sya business ya kureview",
  "kik": "Hatirĩ mĩrigo ya wonjoria ya kũrora",
  "mer": "Hakuna ripoti za biashara za kukagua",
  "kal": "Mami logoiywek ab biashara che kigoito"
}'::jsonb),

('moderation.reportedBy', '{
  "en": "Reported by",
  "sw": "Imeripotiwa na",
  "luo": "Okelo gi",
  "kam": "Yareported ni",
  "kik": "Yarangĩrĩirwo nĩ",
  "mer": "Imeripotiwa na",
  "kal": "Kigoito"
}'::jsonb),

('moderation.reason', '{
  "en": "Reason",
  "sw": "Sababu",
  "luo": "Rach",
  "kam": "Reason",
  "kik": "Gĩtũmi",
  "mer": "Sababu",
  "kal": "Amun"
}'::jsonb),

('moderation.review', '{
  "en": "Review",
  "sw": "Kagua",
  "luo": "Non",
  "kam": "Review",
  "kik": "Rora",
  "mer": "Kagua",
  "kal": "Sir"
}'::jsonb),

('moderation.reviewReport', '{
  "en": "Review Report",
  "sw": "Kagua Ripoti",
  "luo": "Non Ripot",
  "kam": "Review Report",
  "kik": "Rora Mũrigo",
  "mer": "Kagua Ripoti",
  "kal": "Sir Logoiywet"
}'::jsonb),

('moderation.reportDetails', '{
  "en": "Report Details",
  "sw": "Maelezo ya Ripoti",
  "luo": "Weche Ripot",
  "kam": "Details sya Report",
  "kik": "Maũndũ ma Mũrigo",
  "mer": "Maelezo ya Ripoti",
  "kal": "Tetet ab Logoiywet"
}'::jsonb),

('moderation.type.label', '{
  "en": "Type",
  "sw": "Aina",
  "luo": "Kit",
  "kam": "Type",
  "kik": "Mũthemba",
  "mer": "Aina",
  "kal": "Oret"
}'::jsonb),

('moderation.type.price', '{
  "en": "Price Report",
  "sw": "Ripoti ya Bei",
  "luo": "Ripot mar Bei",
  "kam": "Report ya Price",
  "kik": "Mũrigo wa Thogora",
  "mer": "Ripoti ya Bei",
  "kal": "Logoiywet ab Oret"
}'::jsonb),

('moderation.type.comment', '{
  "en": "Comment Report",
  "sw": "Ripoti ya Maoni",
  "luo": "Ripot mar Wach",
  "kam": "Report ya Comment",
  "kik": "Mũrigo wa Macookio",
  "mer": "Ripoti ya Maoni",
  "kal": "Logoiywet ab Ng''alek"
}'::jsonb),

('moderation.type.forum_post', '{
  "en": "Forum Post Report",
  "sw": "Ripoti ya Chapisho",
  "luo": "Ripot mar Forum",
  "kam": "Report ya Forum Post",
  "kik": "Mũrigo wa Forum",
  "mer": "Ripoti ya Chapisho",
  "kal": "Logoiywet ab Forum"
}'::jsonb),

('moderation.type.business', '{
  "en": "Business Report",
  "sw": "Ripoti ya Biashara",
  "luo": "Ripot mar Ohala",
  "kam": "Report ya Business",
  "kik": "Mũrigo wa Wonjoria",
  "mer": "Ripoti ya Biashara",
  "kal": "Logoiywet ab Biashara"
}'::jsonb),

('moderation.itemOwner', '{
  "en": "Item Owner",
  "sw": "Mmiliki wa Kipengee",
  "luo": "Wuon Gino",
  "kam": "Owner wa Item",
  "kik": "Mwene Kĩndũ",
  "mer": "Mmiliki wa Kipengee",
  "kal": "Chiito ne Bo"
}'::jsonb),

('moderation.reportedAt', '{
  "en": "Reported At",
  "sw": "Iliripotiwa",
  "luo": "Ne okel chieng",
  "kam": "Yareported",
  "kik": "Yarangĩrĩirwo",
  "mer": "Iliripotiwa",
  "kal": "Kigoito Ole"
}'::jsonb),

('moderation.reportedContent', '{
  "en": "Reported Content",
  "sw": "Maudhui Yaliyoripotiwa",
  "luo": "Gima okel",
  "kam": "Content ila yareported",
  "kik": "Ũhoro ũrĩa Ũrangĩrĩirwo",
  "mer": "Maudhui Yaliyoripotiwa",
  "kal": "Ng''alek che Kigoito"
}'::jsonb),

('moderation.reportReason', '{
  "en": "Report Reason",
  "sw": "Sababu ya Kuripoti",
  "luo": "Rach mar Kelo",
  "kam": "Reason ya Report",
  "kik": "Gĩtũmi kĩa Kũranga",
  "mer": "Sababu ya Kuripoti",
  "kal": "Amun ab Logoiywet"
}'::jsonb),

('moderation.moderationNote', '{
  "en": "Moderation Note",
  "sw": "Maelezo ya Usimamizi",
  "luo": "Wach Rito",
  "kam": "Note ya Moderation",
  "kik": "Maandĩko ma Ũtongoria",
  "mer": "Maelezo ya Usimamizi",
  "kal": "Siret ab Ribet"
}'::jsonb),

('moderation.noteHint', '{
  "en": "Add a note explaining your moderation decision",
  "sw": "Ongeza maelezo kueleza uamuzi wako wa usimamizi",
  "luo": "Med wach malero paro mari kuom rito",
  "kam": "Add note ya kuexplain decision yaku ya moderation",
  "kik": "Ongera maandĩko makũguũrĩra woni waku wa ũtongoria",
  "mer": "Ongeza maelezo kueleza uamuzi wako wa usimamizi",
  "kal": "Tach siret ne bo ng''alal piret nebo"
}'::jsonb),

('moderation.dismiss', '{
  "en": "Dismiss",
  "sw": "Kataa",
  "luo": "Kwer",
  "kam": "Dismiss",
  "kik": "Rega",
  "mer": "Kataa",
  "kal": "Sis"
}'::jsonb),

('moderation.resolve', '{
  "en": "Resolve",
  "sw": "Tatua",
  "luo": "Los",
  "kam": "Resolve",
  "kik": "Thondeka",
  "mer": "Tatua",
  "kal": "Aitak"
}'::jsonb),

('moderation.noteRequired', '{
  "en": "Note Required",
  "sw": "Maelezo Yanahitajika",
  "luo": "Wach Dwarore",
  "kam": "Note Yendekaa",
  "kik": "Maandĩko Nĩmabataire",
  "mer": "Maelezo Yanahitajika",
  "kal": "Moche Siret"
}'::jsonb),

('moderation.noteRequiredMessage', '{
  "en": "Please add a note explaining your decision before resolving the report",
  "sw": "Tafadhali ongeza maelezo kueleza uamuzi wako kabla ya kutatua ripoti",
  "luo": "Yie imed wach malero paro mari kapok itieko ripot",
  "kam": "Please add note ya kuexplain decision yaku mbee wa kuresolve report",
  "kik": "Ndagũthaitha wongere maandĩko makũguũrĩra woni waku mbere ya gũthondeka mũrigo",
  "mer": "Tafadhali ongeza maelezo kueleza uamuzi wako kabla ya kutatua ripoti",
  "kal": "Tach siret ne bo ng''alal piret nebo ko manaet logoiywet"
}'::jsonb),

('moderation.actionSuccess', '{
  "en": "Action Successful",
  "sw": "Kitendo Kimefaulu",
  "luo": "Tich Otimore",
  "kam": "Action Niilite",
  "kik": "Wĩra Nĩwahinga",
  "mer": "Kitendo Kimefaulu",
  "kal": "Yautiet Kochoget"
}'::jsonb),

('moderation.actionSuccessMessage', '{
  "en": "The report has been processed successfully",
  "sw": "Ripoti imeshughulikiwa kwa mafanikio",
  "luo": "Ripot oselos maber",
  "kam": "Report niiproceswa nesa",
  "kik": "Mũrigo nĩwathondeketwo wega",
  "mer": "Ripoti imeshughulikiwa kwa mafanikio",
  "kal": "Kiaitak logoiywet komie"
}'::jsonb),

('moderation.actionError', '{
  "en": "Action Failed",
  "sw": "Kitendo Kimeshindwa",
  "luo": "Tich Ok Otimore",
  "kam": "Action Yanangika",
  "kik": "Wĩra Ndwahinga",
  "mer": "Kitendo Kimeshindwa",
  "kal": "Yautiet Menngechi"
}'::jsonb); 