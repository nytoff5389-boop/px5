/* Biochem PHB104 · คลังข้อสอบเพิ่มเติม (เน้นความจำ) สร้างจากเนื้อหาในสไลด์บทที่ 1 และบทที่ 2
   TF = ข้อใดถูก / ข้อใดไม่ถูก (ตัวลวงสุ่มจากข้อความผิดหรือถูกของหัวข้อเดียวกัน)
   TB = ตารางข้อเท็จจริง ถามได้ทั้งไปและกลับ ตัวลวงสุ่มจากแถวอื่นในตารางเดียวกัน */
(function(){
const uniq=a=>a.filter((x,i)=>a.indexOf(x)===i);
function TF(t,s,tr,fa){
  const F=fa.map(x=>x[0]);
  tr.forEach(x=>BANK.push({t,lv:'mid',q:'ข้อใดกล่าวถูกต้องเกี่ยวกับ '+s,right:x,wrongs:[],pool:F,why:x}));
  fa.forEach(([x,c])=>BANK.push({t,lv:'mid',q:'ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับ '+s,right:x,wrongs:[],pool:tr,why:'ข้อนี้ผิด '+c}));
}
function TB(t,a,b,rows,extra,exX){
  const Y=uniq(rows.map(r=>r[1]).concat(extra||[])), X=uniq(rows.map(r=>r[0]).concat(exX||[]));
  rows.forEach(([x,y])=>{
    BANK.push({t,lv:'easy',q:a.replace('{x}',x),right:y,wrongs:[],pool:Y.filter(v=>v!==y),why:x+' : '+y});
    if(b&&rows.filter(r=>r[1]===y).length===1) BANK.push({t,lv:'easy',q:b.replace('{y}',y),right:x,wrongs:[],pool:X.filter(v=>v!==x),why:x+' : '+y});
  });
}

/* ===================== บทที่ 1 คาร์โบไฮเดรต ===================== */
TF('c_role','คาร์โบไฮเดรต',[
 'เป็นแหล่งสะสมพลังงานของร่างกาย','เป็นสารตัวกลาง (intermediate) ที่สำคัญใน metabolic pathway','เป็นส่วนประกอบทางเคมีของ cell membrane หรือ cell wall',
 'เป็นส่วนประกอบสำคัญทางโครงสร้างของ DNA และ RNA','เป็นตำแหน่งของตัวรับ (receptor site) บนเซลล์','เกี่ยวข้องกับการจดจำกันได้ของเซลล์ (cell recognition)',
 'ช่วยระบบการขับถ่ายโดยดูดซับสารพิษ','โครงสร้างคาร์บอนจำเป็นต่อการสังเคราะห์กรดอะมิโนชนิดไม่จำเป็น','ประกอบด้วยธาตุ C, H, O ในอัตราส่วน 1 : 2 : 1',
 'มีสูตรทั่วไปคือ (CH2O)n','จัดเป็น polyhydroxy aldehyde หรือ polyhydroxy ketone','มีหมู่ไฮดรอกซิล (–OH) ตั้งแต่ 2 หมู่ขึ้นไป',
 'น้ำตาลที่มีหมู่ aldehyde (–CHO) เรียกว่า aldose','น้ำตาลที่มีหมู่ ketone เรียกว่า ketose','แบ่งเป็น monosaccharide, oligosaccharide, polysaccharide และ complex carbohydrate',
 'Oligosaccharide ประกอบด้วย monosaccharide 2–10 โมเลกุล','Polysaccharide ประกอบด้วย monosaccharide มากกว่า 10 โมเลกุล','Polysaccharide แบ่งเป็น homopolysaccharide และ heteropolysaccharide',
 'Complex carbohydrate เรียกอีกชื่อว่า glycoconjugate','Glucose เป็นตัวอย่างของ aldose ส่วน fructose เป็นตัวอย่างของ ketose','เป็น 1 ใน 4 กลุ่มของ biomolecules ร่วมกับไขมัน กรดนิวคลิอิก และโปรตีน'
],[
 ['ประกอบด้วยธาตุ C, H, O ในอัตราส่วน 1 : 1 : 2','อัตราส่วนที่ถูกคือ C : H : O = 1 : 2 : 1'],['มีสูตรทั่วไปคือ (CHO)n','สูตรทั่วไปคือ (CH2O)n'],
 ['จัดเป็น polyhydroxy carboxylic acid','คาร์โบไฮเดรตเป็น polyhydroxy aldehyde หรือ polyhydroxy ketone'],['มีหมู่ไฮดรอกซิลเพียง 1 หมู่ในโมเลกุล','คาร์โบไฮเดรตมีหมู่ –OH ตั้งแต่ 2 หมู่ขึ้นไป'],
 ['น้ำตาลที่มีหมู่ aldehyde เรียกว่า ketose','หมู่ aldehyde เรียกว่า aldose ส่วนหมู่ ketone เรียกว่า ketose'],['Fructose เป็นตัวอย่างของ aldose','fructose เป็น ketose'],
 ['ทำหน้าที่เป็นตัวเร่งปฏิกิริยาแทนเอนไซม์','การเร่งปฏิกิริยาไม่ใช่บทบาทของคาร์โบไฮเดรต'],['เป็นสารตั้งต้นหลักของฮอร์โมนสเตียรอยด์','ฮอร์โมนสเตียรอยด์สังเคราะห์จาก cholesterol ซึ่งเป็นลิพิด'],
 ['โครงสร้างคาร์บอนจำเป็นต่อการสังเคราะห์กรดอะมิโนชนิดจำเป็น','จำเป็นต่อการสังเคราะห์กรดอะมิโนชนิดไม่จำเป็น'],['Oligosaccharide ประกอบด้วย monosaccharide มากกว่า 10 โมเลกุล','oligosaccharide มี 2–10 โมเลกุล'],
 ['Polysaccharide ประกอบด้วย monosaccharide 2–10 โมเลกุล','polysaccharide มีมากกว่า 10 โมเลกุล'],['Complex carbohydrate เรียกอีกชื่อว่า glycosaminoglycan','complex carbohydrate เรียกว่า glycoconjugate'],
 ['ไม่ละลายน้ำทุกชนิด แต่ละลายได้ดีในตัวทำละลายอินทรีย์','สมบัตินี้เป็นของลิพิดส์'],['หน้าที่หลักคือเป็นฉนวนห่อหุ้มและป้องกันอวัยวะ','หน้าที่นี้เป็นของลิพิดส์'],
 ['DNA และ RNA ไม่มีคาร์โบไฮเดรตเป็นองค์ประกอบ','คาร์โบไฮเดรตเป็นส่วนประกอบสำคัญทางโครงสร้างของ DNA และ RNA'],['Monosaccharide แบ่งย่อยเป็น homo- และ hetero-','การแบ่ง homo และ hetero ใช้กับ polysaccharide'],
 ['ไม่มีบทบาทในการจดจำกันของเซลล์','คาร์โบไฮเดรตเกี่ยวข้องกับ cell recognition'],['น้ำตาลแอลโดสมีหมู่ ketone ที่คาร์บอนตำแหน่งที่ 2','แอลโดสมีหมู่ aldehyde ที่ C1 ส่วนคีโตสมีหมู่ ketone ที่ C2']
]);
TB('c_role','{x} จัดเป็นคาร์โบไฮเดรตกลุ่มใด',null,[
 ['Glucose','Monosaccharide'],['Fructose','Monosaccharide'],['Galactose','Monosaccharide'],['Ribose','Monosaccharide'],['Ribulose','Monosaccharide'],['Mannose','Monosaccharide'],['Erythrose','Monosaccharide'],['Glyceraldehyde','Monosaccharide'],['Sedoheptulose','Monosaccharide'],['Neuraminic acid','Monosaccharide'],
 ['Maltose','Oligosaccharide'],['Sucrose','Oligosaccharide'],['Lactose','Oligosaccharide'],['Trehalose','Oligosaccharide'],['Maltotriose','Oligosaccharide'],['Raffinose','Oligosaccharide'],['Stachyose','Oligosaccharide'],
 ['Starch','Polysaccharide'],['Glycogen','Polysaccharide'],['Cellulose','Polysaccharide'],['Chitin','Polysaccharide'],['Amylose','Polysaccharide'],['Amylopectin','Polysaccharide'],['Dextrin','Polysaccharide'],['Hyaluronic acid','Polysaccharide'],['Heparin','Polysaccharide'],['Chondroitin sulfate','Polysaccharide'],['Keratan sulfate','Polysaccharide'],
 ['Peptidoglycan','Complex carbohydrate'],['Proteoglycan','Complex carbohydrate'],['Glycoprotein','Complex carbohydrate'],['Glycolipid','Complex carbohydrate']
]);
TB('c_role','คาร์โบไฮเดรตที่ประกอบด้วย{x} จัดเป็นกลุ่มใด',null,[
 [' monosaccharide เพียง 1 หน่วย','Monosaccharide'],[' monosaccharide 2–10 โมเลกุล','Oligosaccharide'],[' monosaccharide มากกว่า 10 โมเลกุล','Polysaccharide'],['คาร์โบไฮเดรตจับกับสารอื่นที่ไม่ใช่คาร์โบไฮเดรต','Complex carbohydrate']
]);

TB('c_mono','Monosaccharide ที่มีคาร์บอน {x} อะตอม เรียกว่าอะไร','{y} มีคาร์บอนกี่อะตอม',[['3','Triose'],['4','Tetrose'],['5','Pentose'],['6','Hexose'],['7','Heptose'],['9','Nanose']]);
TB('c_mono','{x} จัดเป็นน้ำตาลกลุ่มใดตามจำนวนคาร์บอน',null,[['Glyceraldehyde','Triose'],['Erythrose','Tetrose'],['Ribose','Pentose'],['Ribulose','Pentose'],['Glucose','Hexose'],['Mannose','Hexose'],['Galactose','Hexose'],['Fructose','Hexose'],['Sedoheptulose','Heptose'],['Neuraminic acid','Nanose']]);
TB('c_mono','{x} จัดเป็นน้ำตาลชนิดใด',null,[['Glucose','Aldohexose'],['Galactose','Aldohexose'],['Mannose','Aldohexose'],['Fructose','Ketohexose'],['Ribose','Aldopentose'],['Ribulose','Ketopentose'],['Glyceraldehyde','Aldotriose'],['Erythrose','Aldotetrose'],['Sedoheptulose','Ketoheptose']]);
TB('c_mono','ข้อใดเป็นลักษณะของ {x}','น้ำตาลใด{y}',[
 ['D-glucose','เป็น aldohexose และเป็นหน่วยย่อยของ starch, glycogen และ cellulose'],['D-fructose','เป็น ketohexose ที่หวานที่สุด และให้พลังงานแก่ spermatozoa'],
 ['Galactose','เป็นหน่วยย่อยของ lactose และเป็นส่วนประกอบของ glycolipid ที่ cell membrane'],['D-ribose','เป็น pentose ในโครงสร้าง nucleic acid และเป็นสารตัวกลางใน PPP']
]);
TF('c_mono','monosaccharide',[
 'เป็น simple sugar ที่มีน้ำตาลเพียง 1 หน่วย','มีลักษณะเป็นผลึกสีขาว ละลายน้ำได้ และมักมีรสหวาน','ที่พบในธรรมชาติมักมีคาร์บอนประมาณ 3–9 อะตอม',
 'การเรียกชื่อตามจำนวนคาร์บอนจะลงท้ายด้วย -ose','ชนิด pentose และ hexose มีความสำคัญมากต่อร่างกาย','D-glucose เป็นแหล่งพลังงานที่สำคัญของร่างกาย',
 'D-fructose พบได้ในผลไม้ทั่วไป','D-fructose ถูกร่างกายเปลี่ยนเป็น glucose เพื่อใช้เป็นพลังงานได้','Galactose ถูกเปลี่ยนเป็น glucose ได้ในร่างกาย',
 'Ribose เป็นส่วนประกอบของโครงสร้าง nucleic acid','Monosaccharide เป็น reducing agent','ถูก oxidize ได้ด้วยตัวออกซิไดซ์อ่อน เช่น Fe3+ หรือ Cu2+',
 'เมื่อถูกออกซิไดซ์ carbonyl carbon จะกลายเป็นหมู่ carboxyl','นำหน้าชื่อด้วย Aldo หรือ Keto ได้ เช่น aldohexose และ ketohexose',
 'Glucose, mannose, galactose และ fructose เป็น hexose','Ribose และ ribulose เป็น pentose','Neuraminic acid เป็นน้ำตาลคาร์บอน 9 อะตอม (nanose)'
],[
 ['D-glucose เป็น ketohexose','D-glucose เป็น aldohexose'],['D-fructose เป็น aldohexose','D-fructose เป็น ketohexose'],['Glucose มีรสหวานมากที่สุด','fructose มีรสหวานมากที่สุด'],
 ['Galactose เป็นหน่วยย่อยของ sucrose','galactose เป็นหน่วยย่อยของ lactose ในน้ำนม'],['Ribose เป็นน้ำตาล hexose','ribose เป็น pentose'],
 ['Ribose เป็นสารตัวกลางใน glycolysis เท่านั้น','ribose เป็นสารตัวกลางใน pentose phosphate pathway'],['Monosaccharide ไม่ละลายน้ำและไม่มีรสหวาน','monosaccharide ละลายน้ำได้และมักมีรสหวาน'],
 ['ที่พบในธรรมชาติมักมีคาร์บอน 10–20 อะตอม','มักมีคาร์บอนประมาณ 3–9 อะตอม'],['Monosaccharide เป็น oxidizing agent','monosaccharide เป็น reducing agent'],
 ['Erythrose เป็นน้ำตาลคาร์บอน 5 อะตอม','erythrose เป็น tetrose (C4)'],['Sedoheptulose เป็นน้ำตาลคาร์บอน 6 อะตอม','sedoheptulose เป็น heptose (C7)'],
 ['Glyceraldehyde เป็น tetrose','glyceraldehyde เป็น triose (C3)'],['Fructose เปลี่ยนเป็น glucose ในร่างกายไม่ได้','fructose ถูกเปลี่ยนเป็น glucose ได้'],
 ['Glucose ไม่เป็นหน่วยย่อยของ cellulose','glucose เป็นหน่วยย่อยของ starch, glycogen และ cellulose']
]);

TB('c_iso','ข้อใดคือนิยามของ {x}','ข้อความ “{y}” คือนิยามของอะไร',[
 ['Stereoisomer','สูตรโมเลกุลเหมือนกัน แต่การจัดเรียงอะตอมต่างกัน'],['Enantiomer','isomer ที่เป็นภาพเงาในกระจกของกันและกัน (D และ L)'],
 ['Epimer','isomer ที่ต่างกันที่ asymmetric carbon เพียงตำแหน่งเดียว'],['Diastereomer','isomer ที่ต่างกันมากกว่า 1 ตำแหน่ง และไม่เป็นภาพเงาในกระจก'],
 ['Anomer','isomer ที่ต่างกันเฉพาะที่ C1 ของ aldose หรือ C2 ของ ketose'],['Chiral carbon','คาร์บอนที่มีอะตอมหรือหมู่อะตอมต่างกัน 4 กลุ่มมาเกาะ'],
 ['Mutarotation','การเปลี่ยนกลับไปมาระหว่าง anomer α และ β ในสารละลาย'],['Primary alcohol','คาร์บอนตัวสุดท้ายใน Fisher projection ที่เป็น –CH2OH']
]);
TB('c_iso','{x} เป็น isomer ชนิดใด',null,[
 ['D-glucose กับ D-galactose','C4 epimer'],['D-glucose กับ D-mannose','C2 epimer'],['D-glucose กับ L-glucose','Enantiomer'],
 ['α-D-glucopyranose กับ β-D-glucopyranose','Anomer'],['D-mannose กับ D-galactose','Diastereoisomer'],['α-D-fructofuranose กับ β-D-fructofuranose','Anomer']
]);
TB('c_iso','ข้อใดเป็นลักษณะของ {x}','“{y}” เป็นลักษณะของสูตรโครงสร้างแบบใด',[
 ['Fisher projection formula','โครงสร้างแบบสายตรง เขียน C1 ไว้บนสุด'],['Haworth ring formula','โครงสร้างวงแหวนที่วางอยู่บนระนาบกระดาษ'],['Conformational formula','โครงสร้างจาก X-ray diffraction มีรูปเก้าอี้หรือเรือ']
],['โครงสร้างแบบเส้นตรงที่ไม่มีคาร์บอน chiral','โครงสร้างสามมิติแบบเกลียวอัลฟา'],['Ball-and-stick formula','Newman projection formula']);
TB('c_iso','น้ำตาลที่มี asymmetric carbon {x} ตำแหน่ง มี isomer ได้ทั้งหมดกี่แบบ',null,[['1','2 แบบ'],['2','4 แบบ'],['3','8 แบบ'],['4','16 แบบ'],['5','32 แบบ']]);
TF('c_iso','โครงสร้างและ isomer ของน้ำตาล',[
 'ใน Fisher projection คาร์บอนที่มีหมู่ aldehyde เขียนไว้บนสุดเป็น C1','ใน ketose หมู่ ketone อยู่ที่คาร์บอนตำแหน่งที่ 2','คาร์บอนตัวสุดท้ายใน Fisher projection คือ primary alcohol (–CH2OH)',
 'D/L series กำหนดจากหมู่ –OH ที่คาร์บอนซึ่งติดกับ primary alcohol','D-series มีหมู่ –OH ดังกล่าวอยู่ทางขวามือ','น้ำตาลในธรรมชาติส่วนใหญ่อยู่ในรูป D-series',
 'Enantiomer มีจุดหลอมเหลวและจุดเดือดเหมือนกัน','Enantiomer หมุนระนาบแสง polarized ต่างกัน','Glucose มี asymmetric carbon 4 ตำแหน่ง จึงมี isomer 16 แบบ',
 'Isomer 16 แบบของ glucose เป็น D-series 8 แบบ และ L-series 8 แบบ','Monosaccharide ที่มีคาร์บอนตั้งแต่ 5 อะตอมขึ้นไปมีแนวโน้มเกิดวงแหวนเมื่อละลายน้ำ',
 'การเกิดวงแหวนของ aldose ผ่านสารตัวกลาง hemiacetal','การเกิดวงแหวนของ ketose ผ่านสารตัวกลาง hemiketal','Anomeric carbon ของ glucose คือ C1','Anomeric carbon ของ fructose คือ C2',
 'โครงสร้างแบบ chair เสถียรเมื่อหมู่ –OH หันแบบ equatorial','หมู่ –OH แบบ equatorial เกิดปฏิกิริยา ester ได้ง่ายกว่าแบบ axial',
 'Stereoisomer เป็นสารคนละชนิดกันและมักมีสมบัติต่างกัน','Stereoisomer มักมี chiral carbon มากกว่า 1 ตำแหน่ง','Glucose ในน้ำเปลี่ยนระหว่าง α และ β ผ่านโครงสร้างแบบเส้นตรง',
 'หมู่ –OH ที่ anomeric carbon เรียกว่า anomeric OH'
],[
 ['D-series มีหมู่ –OH อยู่ทางซ้ายมือ','D-series มี –OH ทางขวา ส่วน L-series ทางซ้าย'],['D/L series กำหนดจากหมู่ –OH ที่ C1','กำหนดจาก –OH ที่คาร์บอนติดกับ primary alcohol'],
 ['Enantiomer มีจุดเดือดต่างกัน','enantiomer มีสมบัติทางกายภาพเหมือนกัน ต่างเพียงการหมุนแสง'],['D-glucose กับ D-galactose เป็น C2 epimer','เป็น C4 epimer'],
 ['D-glucose กับ D-mannose เป็น C4 epimer','เป็น C2 epimer'],['D-mannose กับ D-galactose เป็น epimer','เป็น diastereoisomer'],['Glucose มี asymmetric carbon 3 ตำแหน่ง','glucose มี 4 ตำแหน่ง'],
 ['Anomeric carbon ของ fructose คือ C1','anomeric carbon ของ fructose คือ C2'],['การเกิดวงแหวนของ aldose ผ่าน hemiketal','aldose ผ่าน hemiacetal ส่วน ketose ผ่าน hemiketal'],
 ['Mutarotation คือการเปลี่ยนจาก D-series เป็น L-series','mutarotation คือการเปลี่ยนระหว่าง anomer α และ β'],['โครงสร้าง chair ที่มี –OH แบบ axial เสถียรที่สุด','แบบ equatorial เสถียรที่สุด'],
 ['Haworth ring formula ได้จาก X-ray diffraction','conformational formula ได้จาก X-ray diffraction'],['น้ำตาลในธรรมชาติส่วนใหญ่อยู่ในรูป L-series','ส่วนใหญ่เป็น D-series'],
 ['Epimer ต่างกันที่ asymmetric carbon มากกว่า 1 ตำแหน่ง','epimer ต่างกันเพียงตำแหน่งเดียว'],['Anomer ต่างกันที่คาร์บอนตำแหน่งสุดท้าย','anomer ต่างกันที่ C1 ของ aldose หรือ C2 ของ ketose']
]);

TB('c_der','ข้อใดเป็นลักษณะของ {x}','“{y}” เป็นลักษณะของอนุพันธ์ชนิดใด',[
 ['Alcohol sugar','มีเฉพาะหมู่ –OH เกิดจาก reduction ที่หมู่ฟังก์ชัน'],['Acid sugar','เกิด oxidation จนได้หมู่ carboxylic'],
 ['Ester sugar','น้ำตาลทำปฏิกิริยากับกรดอินทรีย์หรือกรดฟอสฟอริกเกิดพันธะ ester'],['Deoxy sugar','ไฮโดรเจน 1 อะตอมแทนที่หมู่ –OH ที่ asymmetric carbon'],
 ['Amino sugar','หมู่อะมิโนแทนที่หมู่ –OH ที่ตำแหน่งที่ 2 ของ aldohexose'],['Sialic acid','amino sugar acid ที่มีคาร์บอน 9 อะตอม (NANA)']
]);
TB('c_der','{x} จัดเป็นอนุพันธ์ของ monosaccharide ชนิดใด',null,[
 ['Glycerol','Alcohol sugar'],['Sorbitol','Alcohol sugar'],['Glucuronic acid','Acid sugar'],['L-iduronic acid','Acid sugar'],['α-D-glucose-1-phosphate','Ester sugar'],['Fructose-1,6-bisphosphate','Ester sugar'],
 ['Deoxyribose','Deoxy sugar'],['Glucosamine','Amino sugar'],['N-acetylglucosamine','Amino sugar'],['Galactosamine','Amino sugar'],['N-acetylneuraminic acid (NANA)','Sialic acid']
]);
TB('c_der','ข้อใดเป็นความสำคัญของ {x}','ข้อใดตรงกับคำอธิบายนี้ “{y}”',[
 ['Glycerol','ใช้เป็นตัวทำละลายยา'],['Sorbitol','เป็นน้ำตาลแอลกอฮอล์ของกลูโคส'],['Acid sugar','เป็นส่วนประกอบของ mucopolysaccharide เช่น heparin'],
 ['Deoxy sugar','เป็นองค์ประกอบสำคัญใน DNA และพบใน glycoprotein'],['Amino sugar','เป็นส่วนประกอบของ chitin และ glycosaminoglycan ในกระดูกอ่อน'],['Sialic acid','เป็นสารบ่งบอกหมู่เลือดและส่วนประกอบของ glycoprotein']
]);
TF('c_der','อนุพันธ์ของ monosaccharide',[
 'Alcohol sugar มี functional group เฉพาะหมู่ –OH','Alcohol sugar เกิดจาก reduction ที่ตำแหน่งหมู่ฟังก์ชัน','Glycerol ใช้เป็นตัวทำละลายยา','Sorbitol เป็นน้ำตาลแอลกอฮอล์ของกลูโคส',
 'Acid sugar เกิด oxidation ที่ primary alcohol ได้หมู่ carboxylic','หมู่ carboxylic ของ acid sugar มักพบที่คาร์บอนตำแหน่งแรกและ/หรือสุดท้าย','Acid sugar เป็นส่วนประกอบของ mucopolysaccharide ที่พบใน heparin',
 'Ester sugar เกิดจากน้ำตาลทำปฏิกิริยากับกรดอินทรีย์หรือ acyl halide','α-D-glucose-1-phosphate เป็นตัวอย่างของ ester sugar','Deoxy sugar มีไฮโดรเจน 1 อะตอมแทนที่หมู่ –OH ที่ asymmetric carbon',
 'Deoxy sugar เป็นองค์ประกอบสำคัญใน DNA','Amino sugar มีหมู่อะมิโนแทนที่หมู่ –OH ที่ตำแหน่งที่ 2 ของ aldohexose','Amino sugar เป็นส่วนประกอบของ chitin ในโครงสร้างภายนอกของแมลง',
 'Amino sugar เป็นส่วนประกอบของ glycosaminoglycan ในกระดูกอ่อน','Sialic acid หรือ NANA มีคาร์บอน 9 อะตอม','Sialic acid เป็นส่วนประกอบของ glycoprotein','Sialic acid เป็นสารบ่งบอกหมู่เลือด',
 'Sialic acid เป็นส่วนประกอบของเซลล์มะเร็งและเม็ดเลือดแดง','Glycoside compound จัดเป็น derived monosaccharide','Fructose-1,6-bisphosphate เป็นตัวอย่างของ ester sugar',
 'Ester sugar ที่สำคัญเกิดจากน้ำตาลทำปฏิกิริยากับ phosphoric acid','NANA ย่อมาจาก N-acetylneuraminic acid','Alcohol sugar, amino sugar, acid sugar, deoxy sugar และ ester sugar จัดเป็น derived monosaccharide'
],[
 ['Alcohol sugar เกิดจาก oxidation ที่หมู่ฟังก์ชัน','alcohol sugar เกิดจาก reduction'],['Acid sugar เกิดจาก reduction ที่หมู่ aldehyde','acid sugar เกิดจาก oxidation ได้หมู่ carboxylic'],
 ['Deoxy sugar มีหมู่อะมิโนแทนที่หมู่ –OH','deoxy sugar มี H แทนที่ –OH'],['Amino sugar มีหมู่อะมิโนแทนที่ –OH ที่ตำแหน่งที่ 6','แทนที่ที่ตำแหน่งที่ 2 ของ aldohexose'],
 ['Sialic acid มีคาร์บอน 6 อะตอม','sialic acid มี 9 อะตอม'],['Sorbitol เป็นน้ำตาลแอลกอฮอล์ของ fructose','sorbitol เป็นน้ำตาลแอลกอฮอล์ของกลูโคส'],
 ['Glycerol ใช้เป็นสารป้องกันการแข็งตัวของเลือด','glycerol ใช้เป็นตัวทำละลายยา ส่วนสารป้องกันการแข็งตัวของเลือดคือ heparin'],['Ester sugar เชื่อมกันด้วยพันธะ glycosidic','ester sugar มีพันธะ ester'],
 ['Deoxy sugar เป็นองค์ประกอบสำคัญใน RNA','deoxy sugar เป็นองค์ประกอบใน DNA'],['Sialic acid เป็นอนุพันธ์ชนิด alcohol sugar','sialic acid เป็น amino sugar acid'],
 ['Amino sugar ไม่พบใน mucopolysaccharide','amino sugar เป็นส่วนประกอบของ mucopolysaccharide'],['หมู่ carboxylic ของ acid sugar อยู่กลางโมเลกุลเสมอ','มักพบที่คาร์บอนตำแหน่งแรกและ/หรือสุดท้าย'],
 ['NANA ย่อมาจาก N-acetylmuramic acid','NANA คือ N-acetylneuraminic acid'],['Glycerol จัดเป็น amino sugar','glycerol เป็น alcohol sugar']
]);

TB('c_oligo','{x} ประกอบด้วย monosaccharide ใด','น้ำตาลใดประกอบด้วย {y}',[['Maltose','glucose 2 โมเลกุล'],['Sucrose','glucose และ fructose อย่างละ 1 โมเลกุล'],['Lactose','galactose และ glucose'],['Maltotriose','glucose 3 โมเลกุล'],['Raffinose','galactose, glucose และ fructose']]);
TB('c_oligo','{x} เชื่อมกันด้วยพันธะใด','น้ำตาลใดเชื่อมกันด้วยพันธะ {y}',[['Maltose','α(1→4)'],['Sucrose','α1→β2'],['Lactose','β(1→4)'],['Maltotriose','α(1→4)']],['α(1→6)','β(1→6)']);
TB('c_oligo','{x} ถูกย่อยด้วยเอนไซม์ใด',null,[['Maltose','Maltase'],['Lactose','Lactase'],['Maltotriose','Maltase']],['Amylase','Lipase']);
TB('c_oligo','พบหรือได้ {x} จากแหล่งใด','{y} เป็นแหล่งของน้ำตาลใด',[['Sucrose','ผลไม้'],['Lactose','น้ำนม'],['Maltose','การสลายแป้งหรือ dextrin'],['Raffinose','เมล็ดพืชตระกูลถั่ว']]);
TB('c_oligo','{x} เขียนแบบย่อได้อย่างไร','{y} คือน้ำตาลใด',[['Maltose','Glc(α1→4)Glc'],['Sucrose','Glc(α1→β2)Fru'],['Lactose','Gal(β1→4)Glc']],['Glc(β1→4)Glc','Gal(α1→6)Glc'],['Cellobiose','Isomaltose','Trehalose']);
TB('c_oligo','ชื่อเต็มของ {x} คือข้อใด','{y} คือน้ำตาลใด',[['Maltose','α-D-glucopyranosyl-(1→4)-D-glucopyranose'],['Sucrose','α-D-glucopyranosyl-(1→2)-β-D-fructofuranoside'],['Lactose','β-D-galactopyranosyl-(1→4)-D-glucopyranose']],['β-D-glucopyranosyl-(1→4)-D-glucopyranose'],['Cellobiose','Isomaltose','Trehalose']);
TF('c_oligo','disaccharide และ oligosaccharide',[
 'Oligosaccharide ประกอบด้วย monosaccharide 2–10 โมเลกุล','Monosaccharide ใน oligosaccharide อาจเป็นชนิดเดียวกันหรือต่างชนิดกันก็ได้','Disaccharide เกิดจาก monosaccharide 2 โมเลกุลรวมกันด้วยปฏิกิริยา condensation',
 'พันธะโควาเลนต์ที่เชื่อม monosaccharide เรียกว่า glycosidic bond','Disaccharide ที่ยังมี anomeric –OH อิสระเป็น reducing sugar','Sucrose เป็น non-reducing sugar','Trehalose เป็น non-reducing sugar',
 'Maltose และ lactose เป็น reducing sugar','การเรียกชื่อ glycoside เริ่มจากน้ำตาลตัวที่ 1 ตามด้วยชนิดและตำแหน่งของ anomeric carbon',
 'ใน disaccharide หมู่ –OH ของ anomeric carbon ของน้ำตาลตัวแรกเชื่อมกับ –OH ของน้ำตาลตัวที่สอง','Maltose สลายด้วย maltase ได้ glucose 2 โมเลกุล',
 'Sucrose ใช้ anomeric –OH ของทั้ง glucose (C1) และ fructose (C2) ในการเชื่อมกัน','Lactose ถูกย่อยด้วยเอนไซม์ lactase','Maltotriose ถูกย่อยต่อด้วย maltase ในลำไส้เล็ก',
 'Raffinose และ stachyose ประกอบด้วย galactose, glucose และ fructose','Raffinose และ stachyose ไม่ถูกสลายด้วย endogenous enzymes ของพืชและสัตว์'
],[
 ['Sucrose เป็น reducing sugar','sucrose เป็น non-reducing sugar'],['Lactose ประกอบด้วย glucose 2 โมเลกุล','lactose คือ galactose กับ glucose'],['Maltose ประกอบด้วย glucose และ fructose','maltose คือ glucose 2 โมเลกุล'],
 ['Sucrose เชื่อมด้วยพันธะ α(1→4)','sucrose เชื่อมด้วย α1→β2'],['Lactose เชื่อมด้วยพันธะ α(1→4)','lactose เชื่อมด้วย β(1→4)'],['Disaccharide เกิดจากปฏิกิริยา hydrolysis','disaccharide เกิดจาก condensation'],
 ['Maltotriose มี glucose 3 โมเลกุลเชื่อมด้วย β(1→4)','maltotriose เชื่อมด้วย α(1→4)'],['Raffinose พบมากในน้ำนม','raffinose พบในเมล็ดพืชตระกูลถั่ว'],['Lactose ถูกย่อยด้วย maltase','lactose ถูกย่อยด้วย lactase'],
 ['Oligosaccharide ประกอบด้วย monosaccharide ชนิดเดียวกันเท่านั้น','อาจเป็นชนิดเดียวกันหรือต่างกันก็ได้'],['Trehalose เป็น reducing sugar','trehalose เป็น non-reducing sugar'],
 ['Raffinose ถูกย่อยได้ง่ายด้วยเอนไซม์ในลำไส้ของคน','raffinose ไม่ถูกสลายด้วย endogenous enzymes']
]);

TB('c_poly','{x} มีหน่วยย่อยเป็นอะไร','polysaccharide ใดมีหน่วยย่อยเป็น {y}',[
 ['Amylose','glucose'],['Cellulose','glucose'],['Glycogen','glucose'],['Chitin','N-acetylglucosamine'],['Heparin','glucosamine และ L-iduronic acid'],
 ['Chondroitin sulfate','glucuronic acid และ N-acetylgalactosamine sulfate'],['Keratan sulfate','D-galactose และ N-acetylglucosamine-6-sulfate']
]);
TB('c_poly','{x} มีพันธะและการแตกกิ่งแบบใด','polysaccharide ใด{y}',[
 ['Amylose','เชื่อมด้วย α(1→4) ไม่แตกกิ่ง'],['Amylopectin','เชื่อมด้วย α(1→4) แตกกิ่งด้วย α(1→6) ทุก 25–30 หน่วย'],['Glycogen','เชื่อมด้วย α(1→4) แตกกิ่งทุก 8–12 หน่วย'],
 ['Cellulose','เชื่อมด้วย β(1→4) ไม่มีแขนงข้าง'],['Chitin','N-acetylglucosamine เชื่อมด้วย β(1→4)']
]);
TB('c_poly','พบ {x} ได้ที่ใด','{y} เป็นแหล่งที่พบ polysaccharide ใด',[
 ['Starch','เมล็ดข้าว เผือก มัน'],['Glycogen','ตับและกล้ามเนื้อของสัตว์'],['Cellulose','ผนังเซลล์ของพืช'],['Chitin','เปลือกกุ้ง กระดองปู และตัวแมลง'],
 ['Hyaluronic acid','synovial fluid และ vitreous humor ของลูกตา'],['Chondroitin sulfate','โครงสร้างของกระดูกอ่อน']
]);
TB('c_poly','ข้อใดเป็นประโยชน์หรือหน้าที่ของ {x}','สารใด{y}',[
 ['Heparin','ใช้เป็นสารป้องกันการแข็งตัวของเลือด'],['Cellulose','เป็นกากใยอาหาร ป้องกันท้องผูก'],['Glycogen','เป็นพลังงานสำรองในสัตว์ (animal starch)'],
 ['Hyaluronic acid','อุ้มน้ำได้ดี หล่อลื่น และให้ความยืดหยุ่นแก่เซลล์'],['Chitosan','มีประจุบวกสูง ดูดซับน้ำและน้ำมัน ยับยั้งเชื้อราและแบคทีเรีย']
]);
TB('c_poly','{x} จัดเป็น polysaccharide กลุ่มใด',null,[
 ['Starch','Homopolysaccharide สะสมพลังงาน'],['Glycogen','Homopolysaccharide สะสมพลังงาน'],['Cellulose','Homopolysaccharide กลุ่มโครงสร้าง'],['Chitin','Homopolysaccharide กลุ่มโครงสร้าง'],
 ['Hyaluronic acid','Heteropolysaccharide (GAGs)'],['Heparin','Heteropolysaccharide (GAGs)'],['Chondroitin sulfate','Heteropolysaccharide (GAGs)'],['Keratan sulfate','Heteropolysaccharide (GAGs)'],
 ['Dermatan sulfate','Heteropolysaccharide (GAGs)'],['Heparan sulfate','Heteropolysaccharide (GAGs)']
],['Complex carbohydrate (glycoconjugate)']);
TF('c_poly','polysaccharide',[
 'Polysaccharide หรือ glycans เป็นโพลิเมอร์ของ monosaccharide','Polysaccharide ละลายน้ำได้น้อย และไม่มีรสหวาน','เมื่อต้ม polysaccharide จะเป็นคอลลอยด์หรือแป้งเปียก',
 'Cellulose และ amylose มีโครงสร้างแบบสายตรง','Glycogen และ amylopectin มีโครงสร้างแบบแตกแขนง','แป้งประกอบด้วย amylose 15–20% และ amylopectin 80–85%',
 'Amylose ประกอบด้วย glucose 100–1000 โมเลกุล','Amylopectin ประกอบด้วย glucose 300–6000 โมเลกุล','Amylose ขดเป็นเกลียววนซ้ายและทำปฏิกิริยากับ iodine ได้สีน้ำเงิน',
 'Glycogen แตกแขนงถี่กว่า amylopectin','โครงสร้างเส้นตรงของ cellulose ทำให้เกิดพันธะไฮโดรเจนภายในและระหว่างสาย','Chitin ผ่าน deacetylation จะได้ chitosan',
 'GAGs มีประจุลบสูงมาก จึงยืดหยุ่น ลื่น และอุ้มน้ำได้ดี','GAGs ประกอบด้วย repeating disaccharide ของ amino sugar และ uronic acid','Keratan sulfate เป็นสายตรงไม่แตกกิ่ง',
 'Chondroitin sulfate มักอยู่รวมกับ hyaluronic acid'
],[
 ['Amylose แตกกิ่งด้วยพันธะ α(1→6)','amylose ไม่แตกกิ่ง ส่วน amylopectin แตกกิ่ง'],['Cellulose เชื่อมด้วยพันธะ α(1→4)','cellulose เชื่อมด้วย β(1→4)'],['Glycogen เป็นพลังงานสำรองในพืช','glycogen อยู่ในสัตว์ ส่วน starch อยู่ในพืช'],
 ['แป้งมี amylose เป็นองค์ประกอบหลัก 80–85%','amylopectin มี 80–85%'],['Heparin เป็น homopolysaccharide','heparin เป็น heteropolysaccharide'],['Chitosan มีประจุลบสูง','chitosan มีประจุบวกสูง'],
 ['GAGs มีประจุบวกสูงทำให้โมเลกุลอัดกันแน่น','GAGs มีประจุลบสูง แรงยึดเกาะน้อย จึงยืดหยุ่น'],['Polysaccharide มีรสหวานจัดและละลายน้ำได้ดี','polysaccharide ละลายน้ำน้อยและไม่หวาน'],
 ['Glycogen แตกแขนงทุก 25–30 โมเลกุล','glycogen ทุก 8–12 ส่วน amylopectin ทุก 25–30'],['Chitin พบในผนังเซลล์ของพืชชั้นสูง','chitin พบในโครงร่างภายนอกของสัตว์ไม่มีกระดูกสันหลัง'],
 ['Homopolysaccharide ประกอบด้วย monosaccharide มากกว่า 1 ชนิด','homopolysaccharide มี monosaccharide ชนิดเดียว']
]);

TB('c_cplx','ข้อใดตรงกับ {x}','“{y}” คือ complex carbohydrate ชนิดใด',[
 ['Proteoglycan','GAG จับกับโปรตีน มีคาร์โบไฮเดรตราว 90%'],['Glycoprotein','มีโปรตีนมากกว่าคาร์โบไฮเดรต มีคาร์โบไฮเดรตไม่เกิน 20%'],
 ['Glycolipid','คาร์โบไฮเดรตเชื่อมกับลิพิดด้วยพันธะ glycosidic'],['Peptidoglycan','polysaccharide เชื่อมกับ polypeptide ในผนังเซลล์แบคทีเรีย']
]);
TB('c_cplx','{x} คือคาร์โบไฮเดรตที่จับอยู่กับสารใด',null,[['Proteoglycan','Protein'],['Glycoprotein','Protein'],['Glycolipid','Lipid'],['Lipopolysaccharide','Lipid'],['Peptidoglycan','Peptide หรือ polypeptide']],['Nucleic acid']);
TB('c_cplx','พบ {x} ได้ที่ใด','{y} พบ complex carbohydrate ชนิดใด',[
 ['Proteoglycan','เนื้อเยื่อเกี่ยวพันทั่วไปของร่างกาย'],['Glycolipid','เซลล์เมมเบรนของสัตว์และผนังเซลล์ของแบคทีเรีย'],['Peptidoglycan','ผนังเซลล์แบคทีเรียเท่านั้น'],['Glycoprotein','เยื่อหุ้มเซลล์เม็ดเลือดแดงเป็นสารบ่งบอกหมู่เลือด ABO']
]);
TB('c_cplx','“{x}” เป็นบทบาทของ complex carbohydrate ชนิดใด',null,[
 ['การจดจำกันของเซลล์และการเป็น receptor','Glycoprotein'],['เมือกลื่นหล่อลื่นทางเดินหายใจ','Glycoprotein'],['สารบ่งบอกหมู่เลือด ABO ที่เม็ดเลือดแดง','Glycoprotein'],
 ['กำหนดคุณสมบัติของแบคทีเรียและเกี่ยวกับการออกฤทธิ์ของยาปฏิชีวนะ','Peptidoglycan'],['พบทั่วไปในเนื้อเยื่อเกี่ยวพัน มีคาร์โบไฮเดรตราว 90%','Proteoglycan'],['ส่วนประกอบของเซลล์เมมเบรนสัตว์ที่มีความจำเพาะเจาะจง','Glycolipid']
]);
TB('c_cplx','ข้อใดเป็นองค์ประกอบของ {x}','{y} เป็นองค์ประกอบของสารใด',[
 ['Peptidoglycan','N-acetylglucosamine, N-acetylmuramic acid และ tetrapeptide'],['Proteoglycan','glycosaminoglycan และโปรตีน'],['Glycolipid','คาร์โบไฮเดรตและลิพิด'],['Glycoprotein','โปรตีนและ oligosaccharide สายสั้นที่มักมี sialic acid ปลายสาย']
]);
TB('c_cplx','{x} มีคาร์โบไฮเดรตเป็นองค์ประกอบประมาณเท่าใด',null,[['Proteoglycan','ประมาณ 90%'],['Glycoprotein','ไม่เกิน 20%']],['ประมาณ 50%','น้อยกว่า 1%']);
TF('c_cplx','complex carbohydrate',[
 'Complex carbohydrate เรียกอีกชื่อว่า glycoconjugates','ได้แก่ peptidoglycan, proteoglycan, glycoprotein และ glycolipid','เป็นคาร์โบไฮเดรตที่จับกับสารอื่นที่ไม่ใช่คาร์โบไฮเดรต มักด้วยพันธะโควาเลนต์',
 'Proteoglycan เกิดจาก glycosaminoglycan จับกับโปรตีนด้วยพันธะโควาเลนต์','Proteoglycan มีโปรตีนประมาณ 10% และคาร์โบไฮเดรตประมาณ 90%','Glycoprotein มีคาร์โบไฮเดรตไม่เกิน 20%',
 'Glycoprotein มักมี sialic acid เป็นน้ำตาลตัวสุดท้ายทำให้มีประจุลบ','คาร์โบไฮเดรตใน glycoprotein จับกับโปรตีนที่มีหมู่ –OH ด้วยพันธะโควาเลนต์',
 'Glycoprotein มีหน่วย monosaccharide 2–15 หน่วย เป็นเส้นตรงหรือแตกแขนงก็ได้','Glycoprotein เกี่ยวข้องกับการจดจำกันของเซลล์และการเป็น receptor',
 'Glycoprotein ที่เป็นเมือกลื่นช่วยหล่อลื่นทางเดินหายใจ','Glycolipid คือไขมันที่มีคาร์โบไฮเดรตเชื่อมติดด้วยพันธะ glycosidic','Glycolipid เป็นส่วนประกอบของเซลล์เมมเบรนสัตว์และผนังเซลล์แบคทีเรีย',
 'Peptidoglycan เป็นองค์ประกอบของผนังเซลล์แบคทีเรีย','Peptidoglycan มีสาย tetrapeptide เชื่อมระหว่างสาย polysaccharide','สาย polysaccharide ของ peptidoglycan เชื่อม NAG กับ NAM ด้วย β(1→4)',
 'Peptidoglycan เกี่ยวข้องโดยตรงกับการออกฤทธิ์ของยาปฏิชีวนะบางชนิด','Lipopolysaccharide คือคาร์โบไฮเดรตที่จับอยู่กับลิพิด','Proteoglycan เป็นโมเลกุลขนาดใหญ่',
 'Peptidoglycan มีความสำคัญในการกำหนดคุณสมบัติของแบคทีเรียแต่ละชนิด'
],[
 ['Proteoglycan มีโปรตีนมากกว่าคาร์โบไฮเดรต','proteoglycan มีคาร์โบไฮเดรตราว 90%'],['Glycoprotein มีคาร์โบไฮเดรตประมาณ 90%','glycoprotein มีคาร์โบไฮเดรตไม่เกิน 20%'],
 ['Glycoprotein มี sialic acid ปลายสายทำให้มีประจุบวก','sialic acid ทำให้มีประจุลบ'],['Peptidoglycan เป็นองค์ประกอบของเยื่อหุ้มเซลล์สัตว์','peptidoglycan อยู่ในผนังเซลล์แบคทีเรีย'],
 ['Glycolipid คือคาร์โบไฮเดรตที่จับกับโปรตีน','glycolipid จับกับลิพิด'],['Peptidoglycan คือคาร์โบไฮเดรตที่จับกับลิพิด','peptidoglycan จับกับ peptide หรือ polypeptide'],
 ['Complex carbohydrate เชื่อมกับสารอื่นด้วยพันธะไฮโดรเจนเป็นหลัก','มักเชื่อมด้วยพันธะโควาเลนต์'],['Glycoprotein มี monosaccharide มากกว่า 100 หน่วยในสายเดียว','glycoprotein มี 2–15 หน่วย'],
 ['สาย polysaccharide ของ peptidoglycan เชื่อมด้วยพันธะ α(1→6)','เชื่อมด้วย β(1→4)'],['Proteoglycan พบมากที่ผนังเซลล์แบคทีเรีย','proteoglycan พบในเนื้อเยื่อเกี่ยวพัน'],
 ['Glycolipid ไม่มีความจำเพาะเจาะจง','glycolipid มีความจำเพาะเจาะจง'],['คาร์โบไฮเดรตใน glycoprotein จับกับหมู่ฟอสเฟตของโปรตีน','จับกับโปรตีนที่มีหมู่ –OH'],
 ['Peptidoglycan ไม่เกี่ยวข้องกับยาปฏิชีวนะ','peptidoglycan เกี่ยวข้องโดยตรงกับการออกฤทธิ์ของยาปฏิชีวนะบางชนิด']
]);

/* ===================== บทที่ 2 ลิพิดส์ ===================== */
TB('l_intro','{x} มีบทบาทหน้าที่ใด','ลิพิดชนิดใดมีบทบาท “{y}”',[
 ['กรดไขมัน (fatty acid)','แหล่งให้พลังงาน และเป็นองค์ประกอบของ lipids อื่น'],['เอซิลกลีเซอรอล (acylglycerol)','การสะสมและขนส่งไขมัน และควบคุม metabolism'],
 ['ฟอสโฟลิพิดส์ (phospholipids)','โครงสร้าง cell membrane และการส่งสัญญาณผ่านเข้าเซลล์'],['สฟิงโกลิพิดส์ (sphingolipids)','โครงสร้าง cell membrane และแอนติเจนที่ผิวเซลล์'],
 ['อีโคซานอยด์ (eicosanoids)','สารสื่อกลางรักษาสมดุลของร่างกาย เช่น การอักเสบ'],['เทอร์พีนส์ (terpenes)','สารต้นตอในการสังเคราะห์วิตามินและคลอโรฟิลล์'],
 ['สเตียรอยด์ (steroids)','สังเคราะห์คอเลสเตอรอล ฮอร์โมนเพศ และน้ำดี'],['ขี้ผึ้ง (wax)','สารเคลือบผิวหนังและขน']
]);
TB('l_intro','{x} จัดเป็น lipid กลุ่มใด',null,[
 ['Fats','Simple lipids'],['Waxes','Simple lipids'],['Glycerophospholipids','Complex lipids'],['Sphingophospholipids','Complex lipids'],['Glycosphingolipids','Complex lipids'],['Lipoproteins','Complex lipids'],
 ['Steroids','Precursor and derived lipids'],['Glycerol','Precursor and derived lipids'],['กรดไขมัน','Precursor and derived lipids'],['วิตามินที่ละลายในไขมัน','Precursor and derived lipids'],['ฮอร์โมนสเตียรอยด์','Precursor and derived lipids']
],['ไม่จัดเป็น lipid']);
TB('l_intro','ข้อใดเป็นนิยามของ {x}','“{y}” คือนิยามของอะไร',[
 ['Simple lipids','ester ของกรดไขมันกับแอลกอฮอล์'],['Complex lipids','ester ของกรดไขมันที่มีส่วนประกอบอื่นนอกเหนือจากกรดไขมันกับแอลกอฮอล์'],['Fats','ester ของกรดไขมันกับกลีเซอรอล'],
 ['Waxes','ester ของกรดไขมันกับ monohydroxyl alcohol สายยาว'],['Precursor and derived lipids','steroids, glycerol, กรดไขมัน, ฮอร์โมน และวิตามิน']
]);
TF('l_intro','ลิพิดส์',[
 'ลิพิดส์เป็นสารประกอบอินทรีย์ที่ประกอบด้วย C, H, O','Complex lipid อาจมี N และ P เป็นองค์ประกอบ','ลิพิดส์ไม่ละลายน้ำ (hydrophobic)','ลิพิดส์ละลายได้ใน ether, benzene และ chloroform',
 'ลิพิดส์ละลายได้ใน acetone, hexane และ carbon tetrachloride','ลิพิดส์มีโครงสร้างทางเคมีที่หลากหลาย','หน้าที่หลักของลิพิดส์คือเป็นแหล่งให้และสะสมพลังงาน','ลิพิดส์เป็นส่วนประกอบของผนังเยื่อหุ้มเซลล์',
 'ลิพิดส์เป็นฉนวนห่อหุ้มและป้องกันอวัยวะ','ลิพิดส์เป็นสารตั้งต้นของวิตามิน สารสื่อกลาง และฮอร์โมน','แหล่งไขมันจากพืช ได้แก่ ถั่วเหลือง ข้าวโพด และปาล์ม',
 'ในร่างกายพบไขมันที่ adipose tissue, เนื้อเยื่อประสาท และไขกระดูก','Glycolipids ที่จัดเป็น complex lipids ได้แก่ glycosphingolipids','Phospholipids แบ่งเป็น glycerophospholipids และ sphingophospholipids',
 'Isoprenoids ได้แก่ steroid, lipid vitamin และ terpenes','Fats และ waxes จัดเป็น simple lipids','Lipoproteins จัดเป็น complex lipids','Steroids จัดเป็น precursor and derived lipids',
 'Triglyceride และ lipoprotein เป็นรูปแบบหนึ่งที่พบไขมันในร่างกาย'
],[
 ['ลิพิดส์ละลายน้ำได้ดี','ลิพิดส์ไม่ละลายน้ำ แต่ละลายในตัวทำละลายอินทรีย์'],['ลิพิดส์ทุกชนิดมี N และ P เป็นองค์ประกอบ','พบ N และ P เฉพาะบางชนิด (complex lipid)'],
 ['Waxes เป็น ester ของกรดไขมันกับกลีเซอรอล','waxes เป็น ester กับ monohydroxyl alcohol สายยาว ส่วน fats เป็น ester กับกลีเซอรอล'],['Fats จัดเป็น complex lipids','fats เป็น simple lipids'],
 ['Lipoproteins จัดเป็น simple lipids','lipoproteins เป็น complex lipids'],['Steroids จัดเป็น complex lipids','steroids เป็น precursor and derived lipids'],['ลิพิดส์ไม่ละลายใน chloroform','ลิพิดส์ละลายได้ใน chloroform'],
 ['ขี้ผึ้งมีหน้าที่หลักเป็นสารสื่อกลางการอักเสบ','ขี้ผึ้งเป็นสารเคลือบผิวหนังและขน'],['Terpenes เป็นสารตั้งต้นของฮอร์โมนเพศและน้ำดี','นั่นคือ steroids ส่วน terpenes เป็นต้นตอของวิตามินและคลอโรฟิลล์'],
 ['Eicosanoids ทำหน้าที่สะสมพลังงานเป็นหลัก','eicosanoids เป็นสารสื่อกลาง เช่น การอักเสบ'],['Sphingolipids ทำหน้าที่ขนส่งไขมันในเลือด','sphingolipids เป็นโครงสร้าง membrane และแอนติเจนที่ผิวเซลล์'],
 ['Glycolipids จัดเป็น simple lipids','glycolipids เป็น complex lipids'],['ลิพิดส์ไม่ได้ทำหน้าที่เป็นฉนวนป้องกันอวัยวะ','ลิพิดส์เป็นฉนวนห่อหุ้มและป้องกันอวัยวะ'],
 ['หน้าที่หลักของลิพิดส์คือเร่งปฏิกิริยาในเซลล์','หน้าที่หลักคือเป็นแหล่งให้และสะสมพลังงาน']
]);

TB('l_fa','{x} มีชื่อตามระบบว่าอะไร','{y} มีชื่อสามัญว่าอะไร',[
 ['Lauric acid','Dodecanoic acid'],['Myristic acid','Tetradecanoic acid'],['Palmitic acid','Hexadecanoic acid'],['Stearic acid','Octadecanoic acid'],['Arachidic acid','Eicosanoic acid'],
 ['Behenic acid','Docosanoic acid'],['Lignoceric acid','Tetracosanoic acid'],['Palmitoleic acid','9-Hexadecenoic acid'],['Oleic acid','9-Octadecenoic acid'],['Linoleic acid','9,12-Octadecadienoic acid'],
 ['α-Linolenic acid','9,12,15-Octadecatrienoic acid'],['Arachidonic acid','5,8,11,14-Eicosatetraenoic acid'],['EPA','5,8,11,14,17-Eicosapentaenoic acid'],['DHA','4,7,10,13,16,19-Docosahexaenoic acid']
]);
TB('l_fa','{x} พบมากในแหล่งใด',null,[['Lauric acid','น้ำมันมะพร้าวและน้ำมันปาล์ม'],['Arachidic acid','น้ำมันถั่วลิสง'],['α-Linolenic acid','น้ำมันลินสีด'],['EPA','น้ำมันปลา'],['Linoleic acid','ข้าวโพด ถั่วลิสง และถั่วเหลือง']]);
TB('l_fa','{x} เป็นกรดไขมันตั้งต้นของกลุ่มใด','กรดไขมันตั้งต้นของกลุ่ม {y} คือข้อใด',[['Palmitoleic acid','ω-7'],['Oleic acid','ω-9'],['Linoleic acid','ω-6'],['Linolenic acid','ω-3']]);
TB('l_fa','กรดไขมันมีกิ่ง {x} พบที่ใด','กรดไขมันมีกิ่งชนิดใดพบใน{y}',[['Phytanic acid','เนยเหลว'],['Ricinoleic acid','น้ำมันละหุ่ง'],['Cerebronic acid','ระบบประสาทส่วนกลาง']],['น้ำมันปลา'],['Palmitic acid','Oleic acid']);
TF('l_fa','กรดไขมัน',[
 'กรดไขมันอิ่มตัวมีสายไฮโดรคาร์บอนเป็นเส้นตรง','กรดไขมันไม่อิ่มตัวในธรรมชาติมีพันธะคู่แบบ cis ทำให้สายโค้งงอ','Hydrogenation เปลี่ยนพันธะคู่แบบ cis เป็น trans เช่น ในมาการีนและเนยเทียม',
 'กรดไขมันไม่อิ่มตัวทำปฏิกิริยากับออกซิเจนได้ง่าย ทำให้เหม็นหืน','น้ำมันมะพร้าวและน้ำมันปาล์มมีกรดไขมันอิ่มตัวมาก','การละลายน้ำของกรดไขมันลดลงเมื่อสายไฮโดรคาร์บอนยาวขึ้น',
 'เกลือโซเดียมและโพแทสเซียมของกรดไขมันเรียกว่าสบู่','กรดไขมันอิ่มตัวที่มี C ≥ 10 เป็นของแข็งที่อุณหภูมิห้อง','จุดหลอมเหลวเพิ่มขึ้นตามจำนวนคาร์บอน แต่ลดลงตามจำนวนพันธะคู่',
 'กรดไขมันไม่อิ่มตัวทำให้เยื่อหุ้มเซลล์มี fluidity มากขึ้น','Refsum’s disease เกิดจากการสะสม phytanic acid ในระบบประสาท','กรดไขมันจำเป็นที่สำคัญคือ linoleic acid (ω-6) และ linolenic acid (ω-3)',
 'DHA และ EPA เป็นกรดไขมัน ω-3 ที่สกัดได้จากปลา','DHA พบมากในสมองและตัวรับแสงที่จอประสาทตา','EPA ช่วยป้องกันการแข็งตัวของหลอดเลือด','Arachidonic acid เป็นสารตั้งต้นการสังเคราะห์ eicosanoids',
 'กรดไขมันไม่อิ่มตัวต่างประเภท ω สังเคราะห์ข้ามประเภทกันไม่ได้','Solidification number ของกรดไขมันไม่อิ่มตัวต่ำกว่า 0 °C','กรดไขมันมีปลายด้านหนึ่งมีขั้ว (COO–) และอีกด้านไม่มีขั้ว จึงเป็น amphiphilic'
],[
 ['กรดไขมันไม่อิ่มตัวในธรรมชาติส่วนใหญ่อยู่ในรูป trans','ในธรรมชาติเป็นรูป cis'],['จุดหลอมเหลวเพิ่มขึ้นตามจำนวนพันธะคู่','จุดหลอมเหลวลดลงตามจำนวนพันธะคู่'],
 ['กรดไขมันละลายน้ำได้มากขึ้นเมื่อสายยาวขึ้น','การละลายน้ำลดลงเมื่อสายยาวขึ้น'],['ร่างกายสะสมกรดไขมันชนิดมีกิ่งได้ตามปกติ','ปกติร่างกายสลายได้และไม่สะสม'],
 ['Linoleic acid เป็นกรดไขมัน ω-3','linoleic acid เป็น ω-6'],['DHA เป็นกรดไขมัน ω-6','DHA เป็น ω-3'],['กรดไขมันอิ่มตัวมีพันธะคู่ในสาย','กรดไขมันอิ่มตัวมีแต่พันธะเดี่ยว'],
 ['ไขมันสัตว์เป็นของเหลวที่อุณหภูมิห้อง','ไขมันสัตว์เป็นของแข็ง ส่วนน้ำมันพืชเป็นของเหลว'],['ร่างกายสังเคราะห์ linoleic acid ได้เอง','linoleic acid เป็นกรดไขมันจำเป็น ร่างกายสังเคราะห์ไม่ได้'],
 ['Oleic acid เป็นกรดไขมันตั้งต้นของกลุ่ม ω-7','oleic acid เป็น ω-9 ส่วน ω-7 คือ palmitoleic acid'],['กรดไขมันจำเป็นเป็น MUFA ที่มีพันธะคู่ 1 พันธะ','กรดไขมันจำเป็นเป็น PUFA ที่มีพันธะคู่มากกว่า 1']
]);

TB('l_tg','ข้อใดคือปฏิกิริยา {x}','“{y}” คือปฏิกิริยาใด',[
 ['Saponification','ไตรกลีเซอไรด์หรือกรดไขมันทำปฏิกิริยากับด่าง ได้เกลือของกรดไขมัน'],['Esterification','กรดไขมันทำปฏิกิริยากับแอลกอฮอล์ ได้ ester และน้ำ'],['Reduction','รีดักชันของกรดไขมัน ได้แอลดีไฮด์และแอลกอฮอล์'],
 ['Hydrogenation','เติมไฮโดรเจนเข้าในโมเลกุลของกรดไขมันไม่อิ่มตัว'],['Halogenation','เติมแฮโลเจนเข้าในโมเลกุลของกรดไขมันไม่อิ่มตัว'],['Auto-oxidation','ถูกออกซิไดซ์ด้วยออกซิเจนในอากาศ ได้สารพวกแอลดีไฮด์'],
 ['Peroxidation','กรดไขมันไม่อิ่มตัวทำปฏิกิริยากับอนุมูลอิสระ เกิด peroxide radical แบบลูกโซ่']
]);
TB('l_tg','ผลิตภัณฑ์ของปฏิกิริยา {x} คืออะไร','ปฏิกิริยาใดให้ผลิตภัณฑ์เป็น {y}',[
 ['Saponification','เกลือของกรดไขมัน (สบู่) และ glycerol'],['Esterification','ester และน้ำ'],['Reduction ของกรดไขมัน','แอลดีไฮด์และแอลกอฮอล์'],['Halogenation','อนุพันธ์ฮาโลเจนของกรดไขมัน'],
 ['Lipid peroxidation','malondialdehyde เป็นผลผลิตสุดท้าย'],['Hydrogenation ของน้ำมันพืช','ไขมันที่อิ่มตัวมากขึ้น เช่น มาการีน']
]);
TB('l_tg','{x} มีกรดไขมันเกิด ester กับ glycerol กี่หมู่','กลีเซอไรด์ที่มีกรดไขมัน {y} คือข้อใด',[['Monoglyceride','1 หมู่'],['Diglyceride','2 หมู่'],['Triglyceride','3 หมู่']],['4 หมู่'],['Phosphoglyceride','Glycerol']);
TB('l_tg','กรดไขมันที่คาร์บอนตำแหน่งที่ {x} ของไตรกลีเซอไรด์มักเป็นชนิดใด',null,[['1','กรดไขมันอิ่มตัว'],['2','กรดไขมันไม่อิ่มตัว'],['3','เป็นชนิดใดก็ได้']],['กรดไขมันชนิด trans เท่านั้น']);
TB('l_tg','ข้อใดเป็นลักษณะของ {x}','“{y}” คือ wax ชนิดใด',[['Bees wax','Myricyl palmitate (C15H31COOC30H61)'],['ไขปลาวาฬ','ไตรกลีเซอไรด์และไขที่ช่วยการลอยตัวขณะดำน้ำลึกในน้ำเย็น']],['Cholesteryl oleate','Ester ของกรดไขมันกับ glycerol 3 หมู่'],['Lanolin','Carnauba wax']);
TF('l_tg','ไตรกลีเซอไรด์ ขี้ผึ้ง และปฏิกิริยาของลิพิดส์',[
 'ไตรกลีเซอไรด์เป็น ester ของ glycerol กับกรดไขมัน','ประเภทของกลีเซอไรด์ขึ้นกับจำนวน ester ที่หมู่แอลกอฮอล์ของ glycerol','กรดไขมันไม่อิ่มตัวช่วยลดจุดหลอมเหลวของไตรกลีเซอไรด์',
 'ไตรกลีเซอไรด์ไม่มีขั้วและไม่ชอบน้ำ','ไตรกลีเซอไรด์ในสัตว์มักเป็นของแข็งที่อุณหภูมิห้อง เรียกว่า fat','ไตรกลีเซอไรด์ในพืชมักเป็นของเหลว เรียกว่า oil',
 'จุดหลอมเหลวของไตรกลีเซอไรด์ขึ้นกับกรดไขมันที่เป็นองค์ประกอบ','หมีสะสมไตรกลีเซอไรด์เป็นฉนวนและพลังงานในฤดูจำศีล','แมวน้ำและนกเพนกวินใช้ไตรกลีเซอไรด์เป็นแหล่งพลังงานและฉนวนกันหนาว',
 'การสลายไตรกลีเซอไรด์ในร่างกายอาศัยเอนไซม์ lipase','ผลผลิตสุดท้ายของ lipid peroxidation คือ malondialdehyde','Lipid peroxidation เกี่ยวข้องกับการเหม็นหืน (rancidity)',
 'ขี้ผึ้งเป็น ester ของกรดไขมันสายยาว (C14–36) กับ monohydroxyl alcohol สายยาว','ขี้ผึ้งเคลือบผิวหนัง ขน ใบไม้ ผลไม้ และ exoskeleton ของแมลง','ไตรกลีเซอไรด์มีความหนาแน่นต่ำ',
 'Malondialdehyde ใช้เป็นตัวชี้วัด lipid peroxidation'
],[
 ['ไตรกลีเซอไรด์ละลายน้ำได้ดี','ไตรกลีเซอไรด์ไม่มีขั้ว ละลายได้เฉพาะในตัวทำละลายไม่มีขั้ว'],['ไตรกลีเซอไรด์จากพืชเป็นของแข็ง เรียกว่า fat','ในพืชเป็นของเหลว เรียกว่า oil'],
 ['กรดไขมันไม่อิ่มตัวเพิ่มจุดหลอมเหลวของไตรกลีเซอไรด์','กรดไขมันไม่อิ่มตัวลดจุดหลอมเหลว'],['Saponification คือปฏิกิริยาระหว่างกรดไขมันกับแอลกอฮอล์','นั่นคือ esterification ส่วน saponification คือกับด่าง'],
 ['Hydrogenation คือการเติมแฮโลเจนเข้าในกรดไขมัน','hydrogenation คือการเติมไฮโดรเจน'],['ผลผลิตสุดท้ายของ lipid peroxidation คือ glycerol','ผลผลิตสุดท้ายคือ malondialdehyde'],
 ['การสลายไตรกลีเซอไรด์ในร่างกายอาศัยเอนไซม์ amylase','อาศัยเอนไซม์ lipase'],['ขี้ผึ้งเป็น ester ของกรดไขมันกับ glycerol','ขี้ผึ้งเป็น ester กับ monohydroxyl alcohol สายยาว'],
 ['กรดไขมันตำแหน่งที่ 2 ของไตรกลีเซอไรด์มักเป็นชนิดอิ่มตัว','ตำแหน่งที่ 2 มักไม่อิ่มตัว ตำแหน่งที่ 1 มักอิ่มตัว'],['Reduction ของกรดไขมันได้เกลือของกรดไขมัน','reduction ได้แอลดีไฮด์และแอลกอฮอล์'],
 ['Auto-oxidation เกิดกับกรดไขมันอิ่มตัวเป็นหลัก','auto-oxidation เกิดกับกรดไขมันไม่อิ่มตัว'],['ไตรกลีเซอไรด์มีความหนาแน่นสูง','ไตรกลีเซอไรด์มีความหนาแน่นต่ำ']
]);

TB('l_polar','ข้อใดเป็นลักษณะของ {x}','“{y}” คือลิพิดชนิดใด',[
 ['Phosphatidylcholine (lecithin)','พบมากที่เยื่อหุ้มเซลล์'],['Phosphatidylinositol','ถูกตัดได้ diacylglycerol และ inositol triphosphate ซึ่งเป็นสารส่งสัญญาณ'],
 ['Lysophosphatidylcholine','สารตัวกลางสำคัญใน metabolism ของ phospholipid'],['Cardiolipin','พบมากที่ผนัง mitochondria'],
 ['Plasmalogen','มีพันธะอีเทอร์ที่ C1 กับกรดไขมันไม่อิ่มตัว พบมากในสมองและกล้ามเนื้อ'],['Platelet-activating factor','มีกรดไขมันอิ่มตัว C16 ต่อด้วยพันธะอีเทอร์ที่ C1 และหมู่ acetate ที่ C2'],
 ['Ceramide','มีกรดไขมันเชื่อมพันธะเอไมด์กับคาร์บอนตัวที่ 2 และยังมี –OH ที่ C1'],['Sphingomyelin','sphingolipid ชนิดเดียวที่มีฟอสเฟต พบมากที่ myelin sheath'],
 ['Glycosphingolipid','คาร์โบไฮเดรตเชื่อมกับ ceramide เป็นแอนติเจนของหมู่เลือด']
]);
TB('l_polar','{x} จัดเป็นลิพิดกลุ่มใด',null,[
 ['Phosphatidylcholine','Glycerophospholipid'],['Phosphatidylethanolamine','Glycerophospholipid'],['Phosphatidylserine','Glycerophospholipid'],['Phosphatidylinositol','Glycerophospholipid'],['Cardiolipin','Glycerophospholipid'],
 ['Plasmalogen','Ether phospholipid'],['Platelet-activating factor','Ether phospholipid'],['Sphingomyelin','Sphingophospholipid'],['Ceramide','Sphingolipid อย่างง่าย'],
 ['Cerebroside','Glycosphingolipid'],['Ganglioside','Glycosphingolipid'],['Globoside','Glycosphingolipid'],['Sulfatide','Glycosphingolipid'],['Triglyceride','Storage lipid (neutral)']
]);
TF('l_polar','ลิพิดส์มีขั้ว',[
 'มีโครงสร้างใกล้เคียงไตรกลีเซอไรด์ แต่บทบาททางชีวภาพต่างกันสิ้นเชิง','แบ่งเป็นชนิดที่มีฟอสเฟต (glycerophospholipids) และชนิดที่มี sphingosine (sphingolipids)',
 'Glycerophospholipid เรียกอีกชื่อว่า phosphoglyceride','Phospholipid และ sphingolipid เป็นส่วนประกอบของผนังเยื่อหุ้มเซลล์','Glycerophospholipid เป็นองค์ประกอบของน้ำดี (bile)',
 'Glycerophospholipid เป็นแหล่งยึดเกาะของโปรตีนบางชนิดบนเยื่อหุ้มเซลล์','Glycerophospholipid เกี่ยวข้องกับการส่งสัญญาณผ่านเยื่อหุ้มเซลล์','Glycerophospholipid เป็นองค์ประกอบของ lung surfactant',
 'Glycerophospholipid มีโครงสร้าง diacylglycerol กับหมู่ฟอสเฟตที่คาร์บอน 3','Phosphatidate เชื่อมพันธะเอสเทอร์กับสารที่มีหมู่แอลกอฮอล์ได้','Phosphatidylcholine มีชื่อเรียกอีกอย่างว่า lecithin',
 'ความหลากหลายของ sphingolipids เกิดจากโมเลกุลที่มาเชื่อมกับ –OH ที่ C1','Sphingomyelin มีส่วนหัวมีขั้วและมีประจุ แต่ส่วนหางไม่มีขั้ว','Glycosphingolipid เกี่ยวข้องกับการจดจำบนผิวเซลล์และการส่งกระแสประสาท',
 'สารหมู่เลือด O, A, B เป็น glycosphingolipid ที่มี oligosaccharide ต่างกันเชื่อมกับ ceramide','ความผิดปกติของ metabolism ของ glycosphingolipid ทำให้เกิด Tay-Sachs disease',
 'Sphingomyelin พบมากบริเวณ myelin sheath ที่หุ้มแอกซอน','Ether phospholipid มีหมู่ alkyl เชื่อมกับ C1 ของกลีเซอรอลด้วยพันธะอีเทอร์','Ceramide เป็นโครงสร้าง sphingolipid อย่างง่าย',
 'Glycosphingolipid บนผนังเม็ดเลือดแดงประกอบเป็นแอนติเจนของหมู่เลือด'
],[
 ['Sphingolipids มีกลีเซอรอลเป็นแกนกลาง','sphingolipids มี sphingosine'],['Ceramide มีกรดไขมันเชื่อมด้วยพันธะเอสเทอร์ที่ C1','ceramide มีกรดไขมันเชื่อมพันธะเอไมด์ที่ C2'],
 ['Sphingomyelin ไม่มีฟอสเฟตเป็นองค์ประกอบ','sphingomyelin เป็น sphingolipid ชนิดเดียวที่มีฟอสเฟต'],['Plasmalogen มีพันธะอีเทอร์ที่คาร์บอนตำแหน่งที่ 3','plasmalogen มีพันธะอีเทอร์ที่ตำแหน่งที่ 1'],
 ['Platelet-activating factor มีกรดไขมันที่ C2','PAF มีหมู่ acetate (ไม่ใช่กรดไขมัน) ที่ C2'],['Cardiolipin พบมากที่ myelin sheath','cardiolipin พบมากที่ผนัง mitochondria ส่วน sphingomyelin อยู่ที่ myelin sheath'],
 ['Tay-Sachs disease เกิดจากความผิดปกติของ metabolism ของ cholesterol','เกิดจากความผิดปกติของ glycosphingolipid'],['Phosphatidylinositol ถูกตัดได้ glycerol และ choline','ได้ diacylglycerol และ inositol triphosphate'],
 ['Glycerophospholipid มีหมู่ฟอสเฟตที่คาร์บอนตำแหน่งที่ 1','หมู่ฟอสเฟตอยู่ที่คาร์บอน 3'],['Plasmalogen พบมากในตับและไต','plasmalogen พบมากในสมองและกล้ามเนื้อ'],
 ['Lecithin คือ phosphatidylserine','lecithin คือ phosphatidylcholine'],['ความหลากหลายของ sphingolipid เกิดจากโมเลกุลที่เชื่อมกับ –OH ที่ C3','เกิดจากโมเลกุลที่เชื่อมที่ C1'],
 ['ลิพิดมีขั้วมีบทบาทเหมือนไตรกลีเซอไรด์ทุกประการ','บทบาททางชีวภาพต่างกันสิ้นเชิง']
]);

TB('l_eico','{x} มีชื่อย่อว่าอะไร','{y} ย่อมาจากอะไร',[
 ['Prostaglandin','PG'],['Thromboxane','TX'],['Leukotriene','LT'],['Fatty acid hydroperoxide','HPETE'],['Fatty acid hydroxide','HETE'],['Fatty acid epoxide','EET'],['Fatty acid dihydroxide','diHETE']
]);
TB('l_eico','{x} มีฤทธิ์ใด','สารใด{y}',[
 ['Prostacyclin','ยับยั้ง platelet aggregation ขยาย coronary arteries และลดความดัน'],['Thromboxane','ทำงานตรงข้ามกับ prostacyclin'],
 ['Leukotrienes','เพิ่มการหดตัวของหลอดเลือดและกระตุ้นเซลล์ภูมิคุ้มกันในการอักเสบและภาวะแพ้'],['Prostaglandin','กระตุ้นกล้ามเนื้อมดลูกให้หดตัว และทำให้อุณหภูมิร่างกายสูงขึ้น']
]);
TB('l_eico','{x} สร้างจากที่ใดหรือด้วยเอนไซม์ใด','สารใดสร้างจาก {y}',[
 ['Prostacyclin','endothelial cells จาก PGH2 โดย prostacyclin synthase'],['Thromboxane','เกร็ดเลือด โดย thromboxane synthetase และ cyclooxygenase'],['Leukotrienes','arachidonic acid โดย 5-lipoxygenase']
],['ไตด้วยเอนไซม์ renin','ตับโดย HMG-CoA reductase'],['Prostaglandin E','Cholesterol']);
TB('l_eico','Prostaglandin {x} มีสมบัติการละลายแบบใด','prostaglandin ชนิดใด{y}',[['E (PGE)','ละลายได้ใน ether'],['F (PGF)','ละลายได้ใน phosphate buffer']],['ละลายได้ใน ethanol','ละลายได้ใน chloroform'],['A (PGA)','D (PGD)']);
TB('l_eico','{x} มีสัญลักษณ์อย่างไร','กรดไขมัน {y} คือข้อใด',[['Arachidonic acid','20:4 ω-6'],['Eicosatrienoic acid','20:3 ω-6']],['20:5 ω-3','22:6 ω-3'],['Eicosapentaenoic acid','Linoleic acid']);
TF('l_eico','eicosanoids',[
 'ออกฤทธิ์คล้ายฮอร์โมนแต่เฉพาะบริเวณที่สร้างและหลั่ง (local hormone)','ควบคุมความดันเลือดและการเกิดลิ่มเลือด','เกี่ยวข้องกับการเกิดไข้ การอักเสบ และความเจ็บปวด','ควบคุมอุณหภูมิในร่างกาย',
 'Precursor คือกรดไขมัน PUFA คาร์บอน 20 ตัว','Arachidonic acid (20:4 ω-6) เป็น precursor หลักที่พบมากที่สุด','Prostaglandin มีทั้งหมด 6 กลุ่ม คือ A, B, C, D, E และ F',
 'Prostaglandin ประกอบด้วยคาร์บอน 20 อะตอม มีวงแหวน 5 คาร์บอน','Prostaglandin ช่วยในการหลั่งน้ำย่อย','Prostaglandin ควบคุมการสังเคราะห์ cyclic-AMP',
 'Prostaglandin กระตุ้นกล้ามเนื้อเรียบมดลูกให้หดตัวระหว่างมีรอบเดือนและคลอด','Prostaglandin มีผลต่อวัฏจักรการหลับ-ตื่น','Prostaglandin ทำให้อุณหภูมิร่างกายสูงขึ้นและเกิดไข้',
 'Prostaglandin มีผลต่อการตอบสนองของเนื้อเยื่อต่อ epinephrine และ glucagon','Prostacyclin สร้างใน endothelial cells จาก PGH2','Thromboxane สร้างจากเกร็ดเลือด',
 'Leukotrienes สร้างจาก arachidonic acid โดย 5-lipoxygenase','Leukotrienes สำคัญในการอักเสบและภาวะแพ้','Lipoxins จัดเป็น eicosanoids','Prostaglandin ช่วยลดอาการบวมแดงอักเสบ',
 'Prostaglandin มีผลต่อการไหลเวียนโลหิตที่อวัยวะเฉพาะ'
],[
 ['Eicosanoids ออกฤทธิ์ทั่วร่างกายผ่านกระแสเลือดเหมือนฮอร์โมนทั่วไป','eicosanoids ออกฤทธิ์เฉพาะบริเวณที่สร้าง'],['Precursor หลักของ eicosanoids คือ oleic acid','precursor หลักคือ arachidonic acid'],
 ['Prostaglandin มีคาร์บอน 18 อะตอม','prostaglandin มีคาร์บอน 20 อะตอม'],['Prostacyclin กระตุ้น platelet aggregation','prostacyclin ยับยั้ง platelet aggregation'],
 ['Thromboxane สร้างจาก endothelial cells','thromboxane สร้างจากเกร็ดเลือด'],['Leukotrienes สร้างโดยเอนไซม์ cyclooxygenase','leukotrienes สร้างโดย 5-lipoxygenase'],
 ['PGE ละลายได้ใน phosphate buffer','PGE ละลายใน ether ส่วน PGF ละลายใน phosphate buffer'],['Prostaglandin ทำให้อุณหภูมิร่างกายลดลง','prostaglandin ทำให้อุณหภูมิสูงขึ้นเกิดไข้'],
 ['Prostacyclin ทำให้ coronary arteries หดตัว','prostacyclin ขยาย coronary arteries'],['Prostaglandin มีทั้งหมด 4 กลุ่ม','prostaglandin มี 6 กลุ่ม'],['Thromboxane ทำงานเหมือน prostacyclin','thromboxane ทำงานตรงข้ามกับ prostacyclin'],
 ['Eicosanoids สร้างจากกรดไขมันอิ่มตัว 16 คาร์บอน','eicosanoids สร้างจาก PUFA 20 คาร์บอน'],['Leukotrienes ลดการหดตัวของหลอดเลือด','leukotrienes เพิ่มการหดตัวของหลอดเลือด']
]);

TB('l_ster','{x} มีชื่อทางเคมีว่าอะไร','{y} คือวิตามินหรือสารใด',[['Vitamin A','Retinol'],['Vitamin D','Calciferol'],['Vitamin E','Tocopherol'],['Vitamin K','Phylloquinone'],['Vitamin K-2','Menaquinone'],['Coenzyme Q','Ubiquinone']]);
TB('l_ster','{x} มีบทบาทใด','สารใด{y}',[
 ['Vitamin A','บำรุงสายตา ป้องกันตามัวตอนกลางคืน (night blindness)'],['Vitamin D','ช่วยดูดซึมแคลเซียมที่ลำไส้เล็ก ป้องกันโรคกระดูกอ่อน'],['Vitamin E','เป็น anti-sterility vitamin และ antioxidant'],
 ['Vitamin K','เป็น anti-hemorrhagic factor ช่วยสร้างลิ่มเลือด'],['Ubiquinone (Coenzyme Q)','อยู่ใน electron transport system และทำลายอนุมูลอิสระ'],
 ['Dolichol phosphate','ขนส่งน้ำตาลให้โปรตีนในการสังเคราะห์ glycoprotein ที่ ER'],['Phytol','เป็นส่วนประกอบของคลอโรฟิลล์'],['β-carotene','เป็นสารต้นตอของวิตามิน A']
]);
TB('l_ster','{x} จัดเป็นฮอร์โมนกลุ่มใด',null,[['Cortisol','ฮอร์โมนจาก adrenal cortex'],['Aldosterone','ฮอร์โมนจาก adrenal cortex'],['Testosterone','ฮอร์โมนเพศชาย'],['Androsterone','ฮอร์โมนเพศชาย'],['Estrogen','ฮอร์โมนเพศหญิง'],['Progesterone','ฮอร์โมนเพศหญิง']],['ฮอร์โมนจากต่อมใต้สมอง']);
TB('l_ster','ข้อใดเป็นบทบาทของ {x}','ฮอร์โมนใด{y}',[
 ['Estrogen','ควบคุมการเจริญทางเพศหญิง ป้องกันการสะสมไขมันในตับ และเพิ่ม VLDL กับ HDL'],['Progesterone','สร้างจาก corpus luteum เตรียมการฝังตัวของไข่ และการเจริญของต่อมเต้านม']
],['สร้างจาก adrenal medulla และเพิ่มอัตราการเต้นของหัวใจ','ควบคุมสมดุลน้ำและเกลือแร่ที่ท่อไต'],['Testosterone','Cortisol','Aldosterone']);
TF('l_ster','สเตียรอยด์ เทอร์พีน และวิตามินที่ละลายในไขมัน',[
 'โครงสร้างหลักของ steroid คือ cyclopentanoperhydrophenanthrene','Cholesterol เป็น steroid ที่พบมากที่สุดในร่างกาย','หมู่ –OH ของ cholesterol ทำปฏิกิริยากับกรดไขมันได้ cholesterol ester',
 'Cholesterol ester อยู่ร่วมกับ lipoprotein ในพลาสมา','Cholesterol เป็น precursor ของ steroid hormones และ bile acids','Hypercholesterolemia นำไปสู่ atherosclerosis',
 'Terpenes ประกอบด้วยหน่วยย่อย isoprene','วิตามิน A D E K เป็นอนุพันธ์ของ terpenes ที่ละลายในไขมัน','Dolichol phosphate เกิดที่ ER','Phytol เป็นส่วนประกอบของคลอโรฟิลล์ในการสังเคราะห์แสง',
 'Vitamin K-2 สังเคราะห์ได้จากแบคทีเรียในลำไส้','Vitamin E ใช้ป้องกันไขมันเหม็นหืนและป้องกันวิตามิน A และ C สลายตัว','Vitamin A เป็นส่วนประกอบสำคัญใน cornea',
 'Vitamin D ช่วยเสริมการใช้แคลเซียมและฟอสฟอรัสของกระดูกและฟัน','Ubiquinone พบใน heart, liver และ kidney','Vitamin K ช่วยป้องกันกระดูกเปราะบาง',
 'Vitamin E เป็น cofactor ของเอนไซม์ในระบบขนส่งอิเล็กตรอน'
],[
 ['Cholesterol ester เกิดจาก cholesterol ทำปฏิกิริยากับฟอสเฟต','cholesterol ester เกิดจากการทำปฏิกิริยากับกรดไขมัน'],['Terpenes ประกอบด้วยหน่วยย่อย sphingosine','terpenes ประกอบด้วย isoprene'],
 ['Vitamin D คือ tocopherol','vitamin D คือ calciferol ส่วน tocopherol คือวิตามิน E'],['Vitamin K เป็น anti-sterility vitamin','วิตามิน E เป็น anti-sterility ส่วนวิตามิน K เป็น anti-hemorrhagic'],
 ['Vitamin E เป็น anti-hemorrhagic factor','anti-hemorrhagic factor คือวิตามิน K'],['Dolichol phosphate เป็นส่วนประกอบของคลอโรฟิลล์','ส่วนประกอบของคลอโรฟิลล์คือ phytol'],
 ['β-carotene เป็นสารต้นตอของวิตามิน D','β-carotene เป็นสารต้นตอของวิตามิน A'],['Cholesterol เป็น precursor ของ eicosanoids','eicosanoids สร้างจาก arachidonic acid'],
 ['Progesterone สร้างจาก adrenal cortex','progesterone สร้างจาก corpus luteum'],['Cortisol เป็นฮอร์โมนเพศหญิง','cortisol เป็นฮอร์โมนจาก adrenal cortex'],
 ['ร่างกายสังเคราะห์วิตามิน K-2 ไม่ได้ในทุกกรณี','วิตามิน K-2 สังเคราะห์ได้จากแบคทีเรียในลำไส้'],['Ubiquinone ทำหน้าที่ขนส่ง triglyceride ในเลือด','ubiquinone อยู่ใน electron transport และทำลายอนุมูลอิสระ'],
 ['Estrogen ส่งเสริมการสุกของไข่','ตามสไลด์ estrogen ยับยั้งการสุกของไข่']
]);

TB('l_lipo','{x} มีหน้าที่ใด','lipoprotein ชนิดใด{y}',[
 ['Chylomicron','ขนส่ง TG จากอาหาร จากลำไส้ไปยังเนื้อเยื่ออื่น'],['VLDL','ขนส่ง TG และ cholesterol ester บางส่วนจากตับไปยังเนื้อเยื่ออื่น'],
 ['LDL','นำ cholesterol ไปสู่เซลล์ต่าง ๆ (bad cholesterol)'],['HDL','สร้างจากตับ จับกิน cholesterol (good cholesterol)'],['IDL','เป็น VLDL remnant']
]);
TB('l_lipo','apoprotein หลักของ {x} คือข้อใด','lipoprotein ใดมี apoprotein หลักเป็น {y}',[
 ['Chylomicron','apoB-48, apoE และ apoC-II'],['VLDL','apoB-100, apoC-I, apoC-II, apoC-III และ apoE'],['LDL','apoB-100'],['HDL','apoA-I, apoC-I, apoC-II และเอนไซม์ LCAT']
]);
TB('l_lipo','{x} ย่อมาจากอะไร','{y} ใช้ชื่อย่อว่าอะไร',[['VLDL','very low density lipoprotein'],['IDL','intermediate density lipoprotein'],['LDL','low density lipoprotein'],['HDL','high density lipoprotein']]);
TB('l_lipo','ในอนุภาค lipoprotein {x} อยู่ที่ตำแหน่งใด',null,[['Triglyceride','แกนด้านใน'],['Cholesteryl ester','แกนด้านใน'],['Phospholipid','ผิวด้านนอก'],['Free cholesterol','ผิวด้านนอก'],['Apoprotein','แทรกอยู่ที่ผิว ทำหน้าที่เป็นตัวรับ-ส่งสัญญาณ']],['อยู่นอกอนุภาคในพลาสมา']);
TB('l_lipo','ไขมันในร่างกายกลุ่ม {x} มีลักษณะอย่างไร','ไขมันกลุ่มใด{y}',[
 ['Triglyceride','เป็นไขมันที่เป็นกลาง เปรียบเสมือน “ผู้ช่วยผู้ร้าย”'],['Phospholipid','เป็นองค์ประกอบหลักของเยื่อหุ้มเซลล์ เช่น lecithin'],['Cholesterol','พบในเลือด 2 รูปแบบ และเป็นสารตั้งต้นของฮอร์โมน น้ำดี และวิตามิน D']
],['เป็นกรดไขมันที่ไม่จับกับสารอื่น'],['Free fatty acid','Glycolipid']);
TF('l_lipo','lipoproteins',[
 'Lipoprotein เป็น compound lipid ที่มีลิพิดและโปรตีน','Lipoprotein นำพา cholesterol ในเลือดไปยังเซลล์ทั่วร่างกาย','Lipoprotein ที่มีลิพิดมากกว่าโปรตีนเรียกว่า LDL',
 'Lipoprotein ที่มีโปรตีนมากกว่าลิพิดเรียกว่า HDL','Lipoprotein ประกอบด้วย apolipoprotein, phospholipid, cholesterol, cholesteryl ester และ triglyceride','Lipoprotein มีลักษณะเป็นทรงกลม (spherical particle)',
 'Triglyceride และ cholesteryl ester อยู่ด้านในอนุภาค','Phospholipid และ cholesterol อยู่ที่ผิวอนุภาค','Lipoprotein แต่ละชนิดต่างกันที่ความหนาแน่นและประจุ',
 'Lipoprotein แยกได้ด้วย ultracentrifugation และ electrophoresis','LDL อุดมด้วย cholesterol และ cholesteryl ester','LDL เรียกว่า bad cholesterol','HDL เรียกว่า good cholesterol',
 'HDL มีเอนไซม์ LCAT','Chylomicron ขนส่ง TG ที่ได้จากอาหาร','IDL คือ VLDL remnant','ระดับ TG สูงร่วมกับ HDL ต่ำหรือ LDL สูง เพิ่มความเสี่ยงโรคหลอดเลือดหัวใจ',
 'Cholesterol ในเลือดพบ 2 รูปแบบ คือ cholesterol และ cholesterol ester'
],[
 ['LDL มีโปรตีนมากกว่าลิพิด','LDL มีลิพิดมากกว่าโปรตีน'],['HDL เรียกว่า bad cholesterol','HDL คือ good cholesterol'],['Triglyceride อยู่ที่ผิวของ lipoprotein','triglyceride อยู่ด้านใน'],
 ['Phospholipid อยู่ที่แกนกลางของ lipoprotein','phospholipid อยู่ที่ผิว'],['Apoprotein หลักของ LDL คือ apoB-48','LDL มี apoB-100 ส่วน apoB-48 เป็นของ chylomicron'],
 ['VLDL ขนส่ง TG จากอาหารจากลำไส้','นั่นคือ chylomicron ส่วน VLDL ขนส่งจากตับ'],['HDL นำ cholesterol ไปสะสมในเซลล์ต่าง ๆ','HDL จับกิน cholesterol'],
 ['Lipoprotein แยกได้ด้วย saponification','แยกด้วย ultracentrifugation และ electrophoresis'],['IDL คือ HDL remnant','IDL คือ VLDL remnant'],['Chylomicron มี apoA-I เป็น apoprotein หลัก','chylomicron มี apoB-48, apoE และ apoC-II'],
 ['Lipoprotein มีลักษณะเป็นแผ่นแบน','lipoprotein เป็นทรงกลม'],['HDL สร้างจากลำไส้เล็ก','HDL สร้างจากตับ']
]);
})();
