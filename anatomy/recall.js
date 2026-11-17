/* Anatomy BI112 · คลังโจทย์ความจำเพิ่มเติม (ถามตรง ระดับง่าย) โหลดหลัง app.js
   รูปแบบ F(บท,หัวข้อ,[คำถาม],คำตอบ,[ตัวลวง],คำอธิบาย) */
(function(){
if(typeof FACTS==='undefined') return;
function F(ch,tp,q,a,w,x){ FACTS.push({ch:ch,tp:tp,q:Array.isArray(q)?q:[q],a:a,w:w,x:x}); }
function N(ch,tp,q,a,w,x){ FACTS.push({ch:ch,tp:tp,neg:1,q:Array.isArray(q)?q:[q],a:a,w:w,x:x}); }
/* ตารางจับคู่: ถามได้ทั้งไปและกลับ */
function M(ch,tp,qa,qb,rows,x,exB){
  var u=function(a){return a.filter(function(v,i){return a.indexOf(v)===i;});};
  var A=rows.map(function(r){return r[0];}), B=u(rows.map(function(r){return r[1];}).concat(exB||[]));
  rows.forEach(function(r){
    var wb=B.filter(function(v){return v!==r[1];}), wa=A.filter(function(v){return v!==r[0];});
    if(wb.length>=3) FACTS.push({ch:ch,tp:tp,q:[qa.replace('{a}',r[0])],a:r[1],w:wb,x:x||r[0]+' : '+r[1]});
    if(qb&&wa.length>=3&&rows.filter(function(v){return v[1]===r[1];}).length===1) FACTS.push({ch:ch,tp:tp,q:[qb.replace('{b}',r[1])],a:r[0],w:wa,x:x||r[0]+' : '+r[1]});
  });
}

/* ===== บทที่ 1 · ชื่อบริเวณของร่างกาย ===== */
M(1,'reg','คำว่า {a} หมายถึงบริเวณใด','บริเวณ{b} เรียกว่าอะไร',[
 ['Cephalic','ศีรษะ'],['Cervical','คอ'],['Axillary','รักแร้'],['Brachial','ต้นแขน'],['Antebrachial','ปลายแขน'],
 ['Antecubital','ข้อพับศอกด้านหน้า'],['Olecranal','ข้อศอกด้านหลัง'],['Carpal','ข้อมือ'],['Tarsal','ข้อเท้า'],['Femoral','ต้นขา'],
 ['Crural','ปลายขาด้านหน้า (หน้าแข้ง)'],['Sural','น่อง'],['Popliteal','ข้อพับเข่าด้านหลัง'],['Gluteal','ก้น'],['Calcaneal','ส้นเท้า'],
 ['Palmar','ฝ่ามือ'],['Plantar','ฝ่าเท้า'],['Umbilical','สะดือ'],['Inguinal','ขาหนีบ'],['Sternal','กระดูกอก'],
 ['Pectoral','อก'],['Orbital','เบ้าตา'],['Buccal','แก้ม'],['Oral','ปาก'],['Nasal','จมูก'],['Frontal','หน้าผาก'],
 ['Otic','หู'],['Mental','คาง'],['Vertebral','กระดูกสันหลัง'],['Lumbar','เอวด้านหลัง'],['Digital','นิ้ว'],['Patellar','กระดูกสะบ้าหัวเข่า'],
 ['Pedal','เท้า'],['Coxal','สะโพก'],['Acromial','จุดสูงสุดของไหล่'],['Occipital','ท้ายทอย']
],'ชื่อบริเวณของร่างกาย (body regions) ใช้รากศัพท์ละตินบอกตำแหน่ง');
F(1,'reg','Dorsum of hand หมายถึงด้านใดของมือ','หลังมือ',['ฝ่ามือ','ข้อมือ','ปลายนิ้ว'],'dorsum คือด้านหลัง ส่วน palmar คือฝ่ามือ');
F(1,'reg','ช่องท้องแบ่งเป็นบริเวณย่อยได้กี่บริเวณ (regions) ตามเส้นแบ่ง 4 เส้น','9 บริเวณ',['4 บริเวณ','6 บริเวณ','12 บริเวณ'],'เส้นแนวตั้ง 2 เส้นและแนวนอน 2 เส้น แบ่งช่องท้องเป็น 9 regions ส่วนการแบ่งแบบ quadrant ได้ 4 ส่วน');
F(1,'reg','การแบ่งช่องท้องแบบ quadrant ได้กี่ส่วน','4 ส่วน',['2 ส่วน','6 ส่วน','9 ส่วน'],'แบ่งด้วยเส้นตั้งและเส้นนอนที่ตัดผ่านสะดือ ได้ RUQ, LUQ, RLQ, LLQ');
F(1,'reg','บริเวณตรงกลางของช่องท้องที่มีสะดืออยู่เรียกว่าอะไร','Umbilical region',['Epigastric region','Hypogastric region','Lumbar region'],'แถวกลางจากบนลงล่าง: epigastric · umbilical · hypogastric (pubic)');
F(1,'reg','บริเวณกลางท้องส่วนบนเหนือสะดือ (ลิ้นปี่) เรียกว่าอะไร','Epigastric region',['Umbilical region','Hypogastric region','Hypochondriac region'],'epigastric อยู่กลางท้องส่วนบน ใต้กระดูกอก');
F(1,'reg','บริเวณกลางท้องส่วนล่างใต้สะดือเรียกว่าอะไร','Hypogastric (pubic) region',['Epigastric region','Iliac region','Umbilical region'],'hypogastric อยู่ใต้ umbilical region เหนือกระดูกหัวหน่าว');
F(1,'reg','บริเวณท้องด้านข้างส่วนบนใต้กระดูกซี่โครงเรียกว่าอะไร','Hypochondriac region',['Lumbar region','Iliac (inguinal) region','Epigastric region'],'แถวข้าง: hypochondriac (บน) · lumbar (กลาง) · iliac/inguinal (ล่าง)');
F(1,'reg','บริเวณท้องด้านข้างส่วนล่างติดขาหนีบเรียกว่าอะไร','Iliac (inguinal) region',['Hypochondriac region','Lumbar region','Hypogastric region'],'iliac หรือ inguinal region อยู่ข้างล่างสุดของช่องท้องแต่ละข้าง');
F(1,'reg','ไส้ติ่ง (appendix) อยู่ใน quadrant ใดของช่องท้อง','Right lower quadrant (RLQ)',['Left lower quadrant (LLQ)','Right upper quadrant (RUQ)','Left upper quadrant (LUQ)'],'ไส้ติ่งอยู่ท้องน้อยด้านขวา จึงอยู่ใน RLQ');
F(1,'reg','ตับส่วนใหญ่อยู่ใน quadrant ใดของช่องท้อง','Right upper quadrant (RUQ)',['Left upper quadrant (LUQ)','Right lower quadrant (RLQ)','Left lower quadrant (LLQ)'],'ตับอยู่ใต้กะบังลมด้านขวา จึงอยู่ใน RUQ');

/* ===== บทที่ 2 · Glandular epithelium ===== */
F(2,'gland',['Glandular epithelium คือเนื้อเยื่อชนิดใด','ต่อมจัดเป็นเนื้อเยื่อพื้นฐานชนิดใด'],'เนื้อเยื่อบุผิว (epithelial tissue)',['เนื้อเยื่อเกี่ยวพัน (connective tissue)','เนื้อเยื่อกล้ามเนื้อ (muscular tissue)','เนื้อเยื่อประสาท (nervous tissue)'],'ต่อมเกิดจากเซลล์เยื่อบุที่เปลี่ยนแปลงไปทำหน้าที่สร้างและขับสาร');
F(2,'gland',['ต่อมมีท่อเรียกว่าอะไร','ต่อมที่ขับสารออกทางท่อสู่ผิวหรือโพรงเรียกว่าอะไร'],'Exocrine gland',['Endocrine gland','Unicellular gland','Paracrine gland'],'exocrine ขับสารผ่านท่อ (duct) ออกสู่ผิวหรือโพรง');
F(2,'gland',['ต่อมไร้ท่อเรียกว่าอะไร','ต่อมที่หลั่งฮอร์โมนเข้าสู่กระแสเลือดโดยตรงเรียกว่าอะไร'],'Endocrine gland',['Exocrine gland','Merocrine gland','Holocrine gland'],'endocrine ไม่มีท่อ หลั่งฮอร์โมนเข้าสู่ของเหลวระหว่างเซลล์และกระแสเลือด');
F(2,'gland','ต่อมไร้ท่อหลั่งสารชนิดใด','ฮอร์โมน (hormone)',['เมือก (mucin)','เหงื่อ','น้ำลาย'],'endocrine gland หลั่งฮอร์โมนเข้าสู่กระแสเลือด');
F(2,'gland','ข้อใดเป็นต่อมไร้ท่อ','ต่อมไทรอยด์ (thyroid gland)',['ต่อมน้ำลาย (salivary gland)','ต่อมเหงื่อ (sweat gland)','ต่อมไขมัน (sebaceous gland)'],'thyroid ไม่มีท่อ หลั่งฮอร์โมนเข้าสู่เลือด ส่วนอีก 3 ข้อเป็นต่อมมีท่อ');
F(2,'gland','ข้อใดเป็นต่อมมีท่อ','ต่อมเหงื่อ (sweat gland)',['ต่อมไทรอยด์','ต่อมหมวกไต','ต่อมใต้สมอง'],'ต่อมเหงื่อขับเหงื่อผ่านท่อออกสู่ผิวหนัง');
N(2,'gland','ข้อใดไม่ใช่ต่อมไร้ท่อ','ต่อมน้ำลาย (salivary gland)',['ต่อมไทรอยด์ (thyroid)','ต่อมหมวกไต (adrenal)','ต่อมใต้สมอง (pituitary)'],'ต่อมน้ำลายเป็น exocrine gland มีท่อเปิดเข้าช่องปาก');
F(2,'gland','ตับอ่อน (pancreas) จัดเป็นต่อมแบบใด','เป็นทั้งต่อมมีท่อและต่อมไร้ท่อ',['เป็นต่อมมีท่ออย่างเดียว','เป็นต่อมไร้ท่ออย่างเดียว','เป็นต่อมเซลล์เดียว'],'ตับอ่อนขับน้ำย่อยผ่านท่อ (exocrine) และหลั่ง insulin กับ glucagon เข้าเลือด (endocrine)');
F(2,'gland',['Unicellular exocrine gland ที่สำคัญคืออะไร','ต่อมเซลล์เดียวที่สร้างเมือกคืออะไร'],'Goblet cell',['Chondrocyte','Osteocyte','Melanocyte'],'goblet cell เป็นต่อมเซลล์เดียว สร้าง mucin');
F(2,'gland','Goblet cell พบมากที่ใด','เยื่อบุทางเดินอาหารและทางเดินหายใจ',['ผิวหนังชั้นหนังกำพร้า','กระดูกอ่อนข้อต่อ','กล้ามเนื้อหัวใจ'],'goblet cell แทรกในเยื่อบุลำไส้และหลอดลม สร้างเมือกเคลือบผิว');
F(2,'gland','สารที่ goblet cell สร้างคืออะไร','Mucin (เมือก)',['ฮอร์โมน','เอนไซม์ย่อยโปรตีน','ไขมัน (sebum)'],'mucin เมื่อรวมกับน้ำกลายเป็นเมือก (mucus)');
F(2,'gland','Goblet cell มีรูปร่างคล้ายสิ่งใด','ถ้วยไวน์หรือแก้วทรงสูง',['ดาวมีแขนยื่น','กระสวยหัวท้ายแหลม','แผ่นแบนคล้ายเกล็ดปลา'],'ส่วนบนป่องเพราะเต็มไปด้วยเมือก ส่วนล่างเรียว จึงคล้ายถ้วยไวน์ (goblet)');
F(2,'gland','ต่อมที่มีท่อไม่แตกแขนงเรียกว่าอะไร','Simple gland',['Compound gland','Unicellular gland','Endocrine gland'],'simple gland มีท่อเดียวไม่แตกแขนง ส่วน compound gland ท่อแตกแขนง');
F(2,'gland','ต่อมที่มีท่อแตกแขนงเรียกว่าอะไร','Compound gland',['Simple gland','Unicellular gland','Tubular gland'],'compound gland ท่อแตกแขนงหลายชั้น เช่น ต่อมน้ำลายและตับอ่อน');
F(2,'gland','ส่วนหลั่งของต่อมที่เป็นถุงกลมเรียกว่าอะไร','Alveolar (acinar)',['Tubular','Duct','Lacuna'],'ส่วนหลั่งเป็นท่อเรียกว่า tubular ถ้าเป็นถุงกลมเรียกว่า alveolar หรือ acinar');
F(2,'gland','ส่วนหลั่งของต่อมที่เป็นท่อยาวเรียกว่าอะไร','Tubular',['Alveolar','Acinar','Lacuna'],'tubular gland ส่วนหลั่งเป็นท่อ เช่น ต่อมในลำไส้');
F(2,'gland','ต่อมที่สร้างสารเหลวใส มักมีเอนไซม์ เรียกว่าต่อมชนิดใด','Serous gland',['Mucous gland','Mixed gland','Sebaceous gland'],'serous = น้ำใส มักเป็นเอนไซม์ เช่น parotid gland');
F(2,'gland','ต่อมที่สร้างเมือกข้นเหนียวเรียกว่าต่อมชนิดใด','Mucous gland',['Serous gland','Mixed gland','Endocrine gland'],'mucous gland สร้าง mucin ได้เมือก');
F(2,'gland','ต่อมที่สร้างได้ทั้งเมือกและสารเหลวใสเรียกว่าต่อมชนิดใด','Mixed (seromucous) gland',['Serous gland','Mucous gland','Holocrine gland'],'mixed gland มีทั้งเซลล์ serous และ mucous เช่น submandibular gland');
F(2,'gland','ต่อมน้ำลาย parotid จัดเป็นต่อมชนิดใดตามสารคัดหลั่ง','Serous gland',['Mucous gland','Mixed gland','Endocrine gland'],'parotid สร้างน้ำลายใสที่มีเอนไซม์ amylase');
F(2,'gland','ต่อมน้ำลาย submandibular จัดเป็นต่อมชนิดใดตามสารคัดหลั่ง','Mixed gland',['Serous gland ล้วน','Mucous gland ล้วน','Endocrine gland'],'submandibular มีทั้งเซลล์ serous และ mucous');
F(2,'gland','การหลั่งสารที่ปล่อยสารออกทางเยื่อหุ้มเซลล์โดยเซลล์ไม่เสียหายเรียกว่าอะไร','Merocrine secretion',['Apocrine secretion','Holocrine secretion','Endocrine secretion'],'merocrine ใช้ exocytosis เซลล์คงสภาพเดิม เช่น ต่อมน้ำลาย ต่อมเหงื่อ eccrine');
F(2,'gland','การหลั่งสารที่ส่วนยอดของเซลล์หลุดออกไปพร้อมสารเรียกว่าอะไร','Apocrine secretion',['Merocrine secretion','Holocrine secretion','Paracrine secretion'],'apocrine ส่วนยอดเซลล์หลุดไปกับสาร เช่น ต่อมน้ำนม');
F(2,'gland','การหลั่งสารที่ทั้งเซลล์แตกสลายกลายเป็นสารที่หลั่งเรียกว่าอะไร','Holocrine secretion',['Merocrine secretion','Apocrine secretion','Exocytosis'],'holocrine ทั้งเซลล์สลายเป็นสาร เช่น ต่อมไขมัน (sebaceous gland)');
F(2,'gland','ต่อมไขมัน (sebaceous gland) หลั่งสารแบบใด','Holocrine',['Merocrine','Apocrine','Endocrine'],'ทั้งเซลล์แตกสลายกลายเป็น sebum');
F(2,'gland','ต่อมน้ำนม (mammary gland) หลั่งสารแบบใด','Apocrine',['Merocrine','Holocrine','Endocrine'],'ส่วนยอดของเซลล์หลุดออกไปพร้อมหยดไขมันในน้ำนม');
F(2,'gland','ต่อมน้ำลายหลั่งสารแบบใด','Merocrine',['Apocrine','Holocrine','Endocrine'],'ต่อมน้ำลายปล่อยสารด้วย exocytosis เซลล์ไม่เสียหาย');
F(2,'gland','ข้อใดเป็นต่อมที่หลั่งสารแบบ holocrine','ต่อมไขมัน (sebaceous gland)',['ต่อมน้ำลาย','ต่อมน้ำนม','ต่อมเหงื่อ eccrine'],'holocrine = ทั้งเซลล์แตกสลาย พบในต่อมไขมัน');
F(2,'gland','ต่อมไขมัน (sebaceous gland) สร้างสารใด','Sebum (ไขมัน)',['เหงื่อ','เมือก','น้ำย่อย'],'sebum เคลือบผิวหนังและเส้นขน ป้องกันผิวแห้ง');
F(2,'gland','ต่อมไขมันส่วนใหญ่เปิดเข้าสู่สิ่งใด','รูขุมขน (hair follicle)',['ผิวหนังโดยตรงทุกต่อม','หลอดเลือดฝอย','ท่อน้ำเหลือง'],'sebaceous gland ส่วนใหญ่ขับ sebum เข้าสู่ hair follicle');
F(2,'gland','ต่อมเหงื่อ eccrine หลั่งสารแบบใด','Merocrine',['Holocrine','Apocrine แท้','Endocrine'],'ต่อมเหงื่อ eccrine ทั่วร่างกาย หลั่งเหงื่อแบบ merocrine');
F(2,'gland','ต่อมเหงื่อชนิดที่พบมากบริเวณรักแร้และขาหนีบ เปิดสู่รูขุมขน คือชนิดใด','Apocrine sweat gland',['Eccrine sweat gland','Sebaceous gland','Ceruminous gland'],'apocrine sweat gland พบที่รักแร้ ขาหนีบ เริ่มทำงานเมื่อเข้าวัยรุ่น');
F(2,'gland','ส่วนของต่อมมีท่อที่ทำหน้าที่สร้างสารเรียกว่าอะไร','Secretory portion (ส่วนหลั่ง)',['Duct (ท่อ)','Capsule','Septum'],'ต่อมมีท่อประกอบด้วย secretory portion ที่สร้างสาร และ duct ที่นำสารออก');
F(2,'gland','สิ่งที่หุ้มต่อมขนาดใหญ่และแบ่งต่อมเป็นกลีบ (lobe) คืออะไร','Capsule และ septa ของเนื้อเยื่อเกี่ยวพัน',['เยื่อบุผิวชั้นเดียว','กระดูกอ่อน','กล้ามเนื้อเรียบล้วน'],'ต่อมใหญ่มี capsule ห่อหุ้ม และมี septa แทรกแบ่งเป็น lobe และ lobule');
N(2,'gland','ข้อใดไม่ใช่สารที่ glandular epithelium สร้างได้','Collagen fiber',['Mucin','ฮอร์โมน','ไขมัน (sebum)'],'collagen fiber สร้างโดย fibroblast ในเนื้อเยื่อเกี่ยวพัน ไม่ใช่สารที่ต่อมหลั่ง');
F(2,'gland','ต่อมใต้ผิวหนังในช่องหูที่สร้างขี้หู คือต่อมใด','Ceruminous gland',['Sebaceous gland','Lacrimal gland','Eccrine gland'],'ceruminous gland เป็นต่อมเหงื่อดัดแปลงในช่องหูชั้นนอก สร้าง cerumen');
F(2,'gland','ต่อมน้ำนมจัดเป็นต่อมชนิดใด','ต่อมเหงื่อดัดแปลงชนิดมีท่อ',['ต่อมไร้ท่อ','ต่อมเซลล์เดียว','ต่อมไขมันดัดแปลงแบบ holocrine'],'mammary gland เป็น modified sweat gland มีท่อ หลั่งแบบ apocrine');
F(2,'gland','ตามจำนวนเซลล์ ต่อมมีท่อแบ่งได้เป็นแบบใด','Unicellular และ multicellular',['Simple และ compound','Serous และ mucous','Merocrine และ holocrine'],'ตามจำนวนเซลล์: unicellular (goblet cell) และ multicellular');
F(2,'gland','ตามสารคัดหลั่ง ต่อมแบ่งได้เป็นแบบใด','Mucous, serous และ mixed',['Simple และ compound','Tubular และ alveolar','Unicellular และ multicellular'],'mucous = เมือก · serous = น้ำใส · mixed = ทั้งสองแบบ');
F(2,'gland','ตามวิธีหลั่งสาร ต่อมแบ่งได้เป็นแบบใด','Merocrine, apocrine และ holocrine',['Mucous, serous และ mixed','Simple และ compound','Tubular และ acinar'],'แบ่งตามสิ่งที่เกิดกับเซลล์ขณะหลั่งสาร');

/* ===== บทที่ 3 · กระดูกอ่อน ===== */
F(3,'cart',['เซลล์กระดูกอ่อนที่โตเต็มที่เรียกว่าอะไร','เซลล์ที่อยู่ใน lacuna ของกระดูกอ่อนคืออะไร'],'Chondrocyte',['Osteocyte','Fibroblast','Chondroblast'],'chondrocyte อยู่ในช่อง lacuna ภายใน matrix');
F(3,'cart','เซลล์ที่สร้าง matrix ของกระดูกอ่อนเรียกว่าอะไร','Chondroblast',['Chondrocyte','Osteoblast','Osteoclast'],'chondroblast สร้าง matrix แล้วถูกล้อมจนกลายเป็น chondrocyte');
F(3,'cart','ช่องเล็ก ๆ ใน matrix ที่ chondrocyte อาศัยอยู่เรียกว่าอะไร','Lacuna',['Canaliculi','Haversian canal','Osteon'],'chondrocyte อยู่ใน lacuna');
F(3,'cart','เยื่อหุ้มกระดูกอ่อนเรียกว่าอะไร','Perichondrium',['Periosteum','Endosteum','Synovial membrane'],'perichondrium เป็นเนื้อเยื่อเกี่ยวพันหนาแน่นหุ้มกระดูกอ่อน (ยกเว้น fibrocartilage และ articular cartilage)');
F(3,'cart','กระดูกอ่อนมีหลอดเลือดมาเลี้ยงหรือไม่','ไม่มีหลอดเลือด (avascular) ได้อาหารจากการแพร่',['มีหลอดเลือดมากที่สุดในร่างกาย','มีหลอดเลือดเฉพาะแกนกลาง','มีหลอดเลือดเท่ากับกระดูกแข็ง'],'กระดูกอ่อนไม่มีหลอดเลือด ได้สารอาหารจากการแพร่ผ่าน perichondrium จึงซ่อมแซมช้า');
F(3,'cart','เหตุใดกระดูกอ่อนจึงซ่อมแซมตัวเองได้ช้า','เพราะไม่มีหลอดเลือดมาเลี้ยง',['เพราะมีหลอดเลือดมากเกินไป','เพราะไม่มีเซลล์อยู่เลย','เพราะมีแคลเซียมสะสมมาก'],'avascular จึงได้อาหารจากการแพร่ การซ่อมแซมช้า');
F(3,'cart','กระดูกอ่อนชนิดที่พบมากที่สุดในร่างกายคือชนิดใด','Hyaline cartilage',['Elastic cartilage','Fibrocartilage','Articular disc'],'hyaline พบมากที่สุด');
M(3,'cart','{a} เป็นกระดูกอ่อนชนิดใด','กระดูกอ่อนชนิด {b} พบที่ใด',[
 ['ใบหู (auricle)','Elastic cartilage'],['Intervertebral disc','Fibrocartilage'],['Costal cartilage','Hyaline cartilage'],['Epiglottis','Elastic cartilage'],
 ['Pubic symphysis','Fibrocartilage'],['ปลายกระดูกที่ข้อต่อ (articular cartilage)','Hyaline cartilage'],['Meniscus ของเข่า','Fibrocartilage'],
 ['วงกระดูกอ่อนของหลอดลม (trachea)','Hyaline cartilage'],['จมูก','Hyaline cartilage'],['กล่องเสียง (thyroid cartilage)','Hyaline cartilage']
],'hyaline: ปลายกระดูก จมูก กล่องเสียง หลอดลม costal · elastic: ใบหู epiglottis · fibro: disc pubic symphysis meniscus',['Dense regular connective tissue','Compact bone']);
F(3,'cart','เส้นใยเด่นใน elastic cartilage คืออะไร','Elastic fiber',['Collagen fiber หนาแน่น','Reticular fiber','ไม่มีเส้นใย'],'elastic cartilage มี elastic fiber มาก จึงยืดหยุ่นและคืนรูปได้');
F(3,'cart','เส้นใยเด่นใน fibrocartilage คืออะไร','Collagen fiber หนา',['Elastic fiber','Reticular fiber','Actin filament'],'fibrocartilage มี collagen มาก ทนแรงกดอัดและแรงดึงได้ดีที่สุด');
F(3,'cart','กระดูกอ่อนชนิดใดทนแรงกดอัดได้ดีที่สุด','Fibrocartilage',['Hyaline cartilage','Elastic cartilage','Articular cartilage'],'collagen หนาแน่นทำให้ fibrocartilage ทนแรงกดอัด จึงอยู่ใน intervertebral disc');
F(3,'cart','กระดูกอ่อนชนิดใดยืดหยุ่นได้มากที่สุด','Elastic cartilage',['Hyaline cartilage','Fibrocartilage','Calcified cartilage'],'elastic fiber จำนวนมากทำให้ใบหูพับแล้วคืนรูปได้');
F(3,'cart','Matrix ของ hyaline cartilage เมื่อดูด้วยกล้องจุลทรรศน์มีลักษณะอย่างไร','ใสเรียบคล้ายแก้ว เห็นเส้นใยไม่ชัด',['เห็นเส้นใยสีเข้มยืดหยุ่นเป็นร่างแห','เห็นมัดเส้นใยหนาเรียงขนานชัดเจน','มีช่อง Haversian canal เรียงเป็นวง'],'hyaline แปลว่าใสคล้ายแก้ว collagen ละเอียดจึงมองไม่เห็น');
F(3,'cart','โครงร่างของทารกในครรภ์ระยะแรกเป็นกระดูกอ่อนชนิดใด','Hyaline cartilage',['Elastic cartilage','Fibrocartilage','ไม่มีกระดูกอ่อน'],'โครงร่างตัวอ่อนเป็น hyaline cartilage แล้วถูกแทนที่ด้วยกระดูกแข็ง (endochondral ossification)');
F(3,'cart','แผ่นการเจริญ (epiphyseal plate) ของกระดูกยาวเป็นกระดูกอ่อนชนิดใด','Hyaline cartilage',['Elastic cartilage','Fibrocartilage','Articular disc'],'growth plate เป็น hyaline cartilage ทำให้กระดูกยาวขึ้น');
N(3,'cart','ข้อใดไม่ใช่ตำแหน่งของ hyaline cartilage','ใบหู',['Costal cartilage','กล่องเสียง','ปลายกระดูกที่ข้อต่อ'],'ใบหูเป็น elastic cartilage');
N(3,'cart','ข้อใดไม่ใช่ตำแหน่งของ fibrocartilage','Epiglottis',['Intervertebral disc','Pubic symphysis','Meniscus'],'epiglottis เป็น elastic cartilage');
F(3,'cart','กระดูกอ่อนชนิดใดไม่มี perichondrium หุ้ม','Fibrocartilage',['Elastic cartilage','Hyaline cartilage ที่หลอดลม','กระดูกอ่อนใบหู'],'fibrocartilage และ articular cartilage ไม่มี perichondrium');

/* ===== บทที่ 3 · ข้อต่อ ===== */
F(3,'joint','ข้อต่อแบ่งตามโครงสร้างได้กี่ชนิด','3 ชนิด คือ fibrous, cartilaginous และ synovial',['2 ชนิด คือ fibrous และ synovial','3 ชนิด คือ synarthrosis, amphiarthrosis และ diarthrosis','4 ชนิด คือ hinge, pivot, ball and socket และ plane'],'แบ่งตามโครงสร้าง (สิ่งที่ยึด) ได้ fibrous, cartilaginous, synovial');
F(3,'joint','ข้อต่อแบ่งตามการเคลื่อนไหวได้แบบใด','Synarthrosis, amphiarthrosis และ diarthrosis',['Fibrous, cartilaginous และ synovial','Hinge, pivot และ saddle','Suture, syndesmosis และ gomphosis'],'synarthrosis ไม่เคลื่อนไหว · amphiarthrosis เคลื่อนเล็กน้อย · diarthrosis เคลื่อนได้มาก');
F(3,'joint','ข้อต่อแบบ synarthrosis เคลื่อนไหวได้อย่างไร','เคลื่อนไหวไม่ได้',['เคลื่อนไหวได้เล็กน้อย','เคลื่อนไหวได้มากและอิสระ','หมุนได้รอบแกนเท่านั้น'],'synarthrosis เช่น suture ของกะโหลก');
F(3,'joint','ข้อต่อแบบ amphiarthrosis เคลื่อนไหวได้อย่างไร','เคลื่อนไหวได้เล็กน้อย',['เคลื่อนไหวไม่ได้','เคลื่อนไหวได้มากและอิสระ','หมุนได้รอบแกนเท่านั้น'],'amphiarthrosis เช่น pubic symphysis และ intervertebral disc');
F(3,'joint','ข้อต่อแบบ diarthrosis เคลื่อนไหวได้อย่างไร','เคลื่อนไหวได้มากและอิสระ',['เคลื่อนไหวไม่ได้','เคลื่อนไหวได้เล็กน้อย','เคลื่อนไหวได้เฉพาะเมื่อมีกระดูกอ่อนเชื่อม'],'diarthrosis คือ synovial joint ทั้งหมด');
F(3,'joint','ข้อต่อที่เคลื่อนไหวไม่ได้เรียกว่าอะไร','Synarthrosis',['Amphiarthrosis','Diarthrosis','Synovial joint'],'syn = รวม arthrosis = ข้อต่อ เคลื่อนไหวไม่ได้');
F(3,'joint','ข้อต่อที่เคลื่อนไหวได้เล็กน้อยเรียกว่าอะไร','Amphiarthrosis',['Synarthrosis','Diarthrosis','Gomphosis'],'amphiarthrosis เคลื่อนได้เล็กน้อย');
F(3,'joint','Synovial joint จัดเป็นข้อต่อแบบใดตามการเคลื่อนไหว','Diarthrosis',['Synarthrosis','Amphiarthrosis','Syndesmosis'],'synovial joint เคลื่อนได้มากจึงเป็น diarthrosis');
M(3,'joint','{a} จัดเป็นข้อต่อชนิดใด','ข้อใดเป็นตัวอย่างของ {b}',[
 ['Suture ของกะโหลกศีรษะ','Fibrous joint แบบ suture'],['ข้อต่อระหว่างรากฟันกับเบ้าฟัน','Fibrous joint แบบ gomphosis'],['ข้อต่อระหว่าง radius กับ ulna ด้วย interosseous membrane','Fibrous joint แบบ syndesmosis'],
 ['Pubic symphysis','Cartilaginous joint แบบ symphysis'],['Epiphyseal plate','Cartilaginous joint แบบ synchondrosis'],['ข้อเข่า','Synovial joint แบบ hinge']
],'fibrous: suture gomphosis syndesmosis · cartilaginous: symphysis synchondrosis · synovial: มีช่องข้อ');
M(3,'joint','{a} เป็น synovial joint แบบใด','ข้อใดเป็น synovial joint แบบ {b}',[
 ['ข้อไหล่','Ball and socket'],['ข้อศอก (humeroulnar)','Hinge'],['ข้อต่อระหว่าง atlas กับ axis','Pivot'],['ข้อต่อฐานนิ้วหัวแม่มือ (carpometacarpal ของนิ้วโป้ง)','Saddle'],
 ['ข้อต่อระหว่างกระดูกข้อมือ (intercarpal)','Plane (gliding)'],['ข้อต่อระหว่าง radius กับกระดูกข้อมือ (radiocarpal)','Condyloid (ellipsoid)']
],'ball and socket: ไหล่ สะโพก · hinge: ศอก เข่า · pivot: atlas-axis · saddle: ฐานนิ้วโป้ง · plane: intercarpal · condyloid: ข้อมือ');
F(3,'joint','ข้อสะโพกเป็น synovial joint แบบใด','Ball and socket',['Hinge','Pivot','Saddle'],'หัวกระดูก femur กลมสวมใน acetabulum เคลื่อนได้รอบทิศ');
F(3,'joint','Synovial joint แบบใดเคลื่อนไหวได้รอบทิศทางมากที่สุด','Ball and socket joint',['Hinge joint','Pivot joint','Plane joint'],'ball and socket เคลื่อนได้หลายแกน เช่น ไหล่ สะโพก');
F(3,'joint','Hinge joint เคลื่อนไหวในลักษณะใด','งอและเหยียดในแนวเดียวคล้ายบานพับ',['หมุนรอบแกนตัวเอง','เคลื่อนได้รอบทิศ','เลื่อนไถลบนผิวเรียบ'],'hinge joint เคลื่อนแกนเดียว flexion และ extension');
F(3,'joint','Pivot joint เคลื่อนไหวในลักษณะใด','หมุนรอบแกน (rotation)',['งอและเหยียดเท่านั้น','เลื่อนไถลบนผิวเรียบ','เคลื่อนได้รอบทิศทุกแกน'],'pivot เช่น atlas หมุนรอบ dens ของ axis ทำให้ส่ายหน้าได้');
F(3,'joint','ของเหลวที่หล่อลื่นภายในช่องข้อต่อ synovial เรียกว่าอะไร','Synovial fluid',['Cerebrospinal fluid','Serous fluid','Lymph'],'synovial fluid หล่อลื่นและเลี้ยงกระดูกอ่อนข้อต่อ');
F(3,'joint','เยื่อที่สร้าง synovial fluid คืออะไร','Synovial membrane',['Fibrous capsule','Periosteum','Articular cartilage'],'synovial membrane บุด้านในของ articular capsule สร้าง synovial fluid');
F(3,'joint','Articular capsule ประกอบด้วยชั้นใด','Fibrous capsule ชั้นนอก และ synovial membrane ชั้นใน',['Synovial membrane ชั้นนอก และ fibrous capsule ชั้นใน','Periosteum ชั้นนอก และ endosteum ชั้นใน','Perichondrium ทั้งสองชั้น'],'fibrous capsule แข็งแรงอยู่นอก synovial membrane อยู่ใน');
F(3,'joint','ผิวกระดูกที่สัมผัสกันในข้อต่อ synovial ถูกคลุมด้วยสิ่งใด','Articular cartilage ชนิด hyaline',['Elastic cartilage','Fibrocartilage','Periosteum'],'articular cartilage เป็น hyaline ช่วยลดแรงเสียดทาน');
F(3,'joint','ถุงน้ำเล็ก ๆ ที่ลดการเสียดสีระหว่างเอ็นกับกระดูกรอบข้อต่อเรียกว่าอะไร','Bursa',['Meniscus','Ligament','Lacuna'],'bursa เป็นถุงบุด้วย synovial membrane มี synovial fluid');
F(3,'joint','โครงสร้างที่ยึดกระดูกกับกระดูกบริเวณข้อต่อคืออะไร','Ligament (เอ็นยึดข้อ)',['Tendon (เอ็นกล้ามเนื้อ)','Bursa','Synovial membrane'],'ligament ยึดกระดูกกับกระดูก ส่วน tendon ยึดกล้ามเนื้อกับกระดูก');
F(3,'joint','แผ่นกระดูกอ่อนรูปจันทร์เสี้ยวในข้อเข่าคืออะไร','Meniscus',['Bursa','Articular capsule','Patella'],'meniscus เป็น fibrocartilage ช่วยรับแรงกระแทกในข้อเข่า');
N(3,'joint','ข้อใดไม่ใช่ส่วนประกอบของ synovial joint','Intervertebral disc',['Articular cartilage','Synovial membrane','Joint cavity'],'intervertebral disc อยู่ใน cartilaginous joint (symphysis)');

/* ===== บทที่ 5 · ประเภทระบบประสาทและเส้นประสาท ===== */
F(5,'ns','ระบบประสาทส่วนกลาง (CNS) ประกอบด้วยอะไร','สมองและไขสันหลัง',['สมองและเส้นประสาทสมอง','ไขสันหลังและเส้นประสาทไขสันหลัง','เส้นประสาทสมองและเส้นประสาทไขสันหลัง'],'CNS = brain + spinal cord');
F(5,'ns','เส้นประสาทสมอง (cranial nerve) มีกี่คู่','12 คู่',['10 คู่','31 คู่','33 คู่'],'cranial nerve มี 12 คู่');
F(5,'ns','เส้นประสาทไขสันหลัง (spinal nerve) มีกี่คู่','31 คู่',['12 คู่','30 คู่','33 คู่'],'spinal nerve มี 31 คู่ (C8 T12 L5 S5 Co1)');
N(5,'ns','ข้อใดไม่ใช่ส่วนของระบบประสาทส่วนปลาย (PNS)','ไขสันหลัง',['เส้นประสาทสมอง 12 คู่','เส้นประสาทไขสันหลัง 31 คู่','ระบบประสาทอัตโนมัติ'],'ไขสันหลังเป็นส่วนของ CNS');
F(5,'ns','ระบบประสาทอัตโนมัติแบ่งเป็นส่วนใด','Sympathetic และ parasympathetic',['Sensory และ motor','Somatic และ visceral sensory','Afferent และ efferent'],'ANS แบ่งเป็น sympathetic และ parasympathetic');
F(5,'ns','Gray matter ประกอบด้วยส่วนใดของเซลล์ประสาทเป็นหลัก','ตัวเซลล์ (cell body)',['Axon ที่มี myelin','Schwann cell','Node of Ranvier'],'gray matter = ตัวเซลล์และ dendrite · white matter = axon มี myelin');
F(5,'ns','White matter มีสีขาวเพราะสิ่งใด','Myelin ที่หุ้ม axon',['ตัวเซลล์ประสาทจำนวนมาก','เลือดไปเลี้ยงน้อย','น้ำไขสันหลังที่ห่อหุ้ม'],'myelin เป็นไขมัน ทำให้เห็นเป็นสีขาว');
F(5,'ns','ในสมองใหญ่ gray matter อยู่ตำแหน่งใด','อยู่ด้านนอก (cortex)',['อยู่ด้านใน','อยู่เฉพาะในโพรงสมอง','ไม่มี gray matter'],'สมอง: เทานอก ขาวใน · ไขสันหลัง: เทาใน ขาวนอก');
F(5,'ns','ในไขสันหลัง gray matter อยู่ตำแหน่งใด','อยู่ด้านในเป็นรูปผีเสื้อหรือตัว H',['อยู่ด้านนอกล้อมรอบ','อยู่เฉพาะที่ dorsal root ganglion','ไม่มี gray matter'],'ไขสันหลังเทาอยู่ใน ขาวอยู่นอก');
F(5,'ns','เซลล์ที่สร้าง myelin ใน CNS คืออะไร','Oligodendrocyte',['Schwann cell','Astrocyte','Microglia'],'CNS = oligodendrocyte · PNS = Schwann cell');
F(5,'ns','เซลล์ที่สร้าง myelin ใน PNS คืออะไร','Schwann cell',['Oligodendrocyte','Astrocyte','Ependymal cell'],'Schwann cell หุ้ม axon ในระบบประสาทส่วนปลาย');
F(5,'ns','ช่องว่างระหว่าง myelin ที่เรียงต่อกันเป็นปล้องเรียกว่าอะไร','Node of Ranvier',['Synapse','Axon hillock','Neuromuscular junction'],'node of Ranvier ทำให้กระแสประสาทกระโดดได้เร็ว (saltatory conduction)');
F(5,'ns','Motor neuron หนึ่งตัวรวมกับเส้นใยกล้ามเนื้อทั้งหมดที่มันควบคุมเรียกว่าอะไร','Motor unit',['Motor end plate','Reflex arc','Sarcomere'],'motor unit = motor neuron + เส้นใยกล้ามเนื้อที่ควบคุม');
F(5,'ns','เส้นประสาทที่นำความรู้สึกเข้าสู่ CNS เรียกว่าอะไร','Sensory (afferent) nerve',['Motor (efferent) nerve','Interneuron','Autonomic nerve'],'sensory = afferent นำเข้า · motor = efferent นำออก');
F(5,'ns','เส้นประสาทที่นำคำสั่งจาก CNS ไปยังอวัยวะเป้าหมายเรียกว่าอะไร','Motor (efferent) nerve',['Sensory (afferent) nerve','Olfactory nerve','Dorsal root'],'motor nerve นำคำสั่งออกไปยังกล้ามเนื้อหรือต่อม');
F(5,'ns','เส้นประสาทที่มีทั้ง sensory และ motor fiber เรียกว่าอะไร','Mixed nerve',['Sensory nerve','Motor nerve','Interneuron'],'mixed nerve เช่น spinal nerve ทุกเส้น');
F(5,'ns','Spinal nerve จัดเป็นเส้นประสาทชนิดใด','Mixed nerve',['Sensory nerve ล้วน','Motor nerve ล้วน','Autonomic nerve ล้วน'],'spinal nerve ทุกเส้นมีทั้ง sensory และ motor fiber');
F(5,'ns','Olfactory nerve (CN I) จัดเป็นเส้นประสาทชนิดใด','Sensory nerve',['Motor nerve','Mixed nerve','Autonomic nerve'],'olfactory nerve รับกลิ่นอย่างเดียว');
F(5,'ns','ส่วนของเซลล์ประสาทที่รับสัญญาณเข้าสู่ตัวเซลล์คืออะไร','Dendrite',['Axon','Axon terminal','Myelin sheath'],'dendrite รับสัญญาณ axon นำสัญญาณออกจากตัวเซลล์');
F(5,'ns','ส่วนของเซลล์ประสาทที่นำสัญญาณออกจากตัวเซลล์คืออะไร','Axon',['Dendrite','Nissl body','Nucleus'],'axon นำกระแสประสาทออกจากตัวเซลล์ไปยังเซลล์ถัดไป');
F(5,'ns','กลุ่มตัวเซลล์ประสาทที่อยู่นอก CNS เรียกว่าอะไร','Ganglion',['Nucleus','Tract','Cortex'],'ใน CNS กลุ่มตัวเซลล์เรียก nucleus นอก CNS เรียก ganglion');
F(5,'ns','มัด axon ภายใน CNS เรียกว่าอะไร','Tract',['Nerve','Ganglion','Plexus'],'ใน CNS เรียก tract ส่วนใน PNS เรียก nerve');
F(5,'ns','เซลล์ค้ำจุนระบบประสาทเรียกรวมว่าอะไร','Neuroglia (glial cell)',['Neuron','Nephron','Chondrocyte'],'neuroglia ค้ำจุน เลี้ยง และป้องกันเซลล์ประสาท');
F(5,'ns','เซลล์ค้ำจุนใน CNS ที่ทำหน้าที่จับกินเชื้อโรคและเศษเซลล์คืออะไร','Microglia',['Astrocyte','Oligodendrocyte','Ependymal cell'],'microglia เป็น phagocyte ของ CNS');
F(5,'ns','เซลล์ค้ำจุนรูปดาวที่ช่วยสร้าง blood brain barrier คืออะไร','Astrocyte',['Microglia','Schwann cell','Satellite cell'],'astrocyte มีแขนยื่นไปพันหลอดเลือดฝอย ช่วยสร้าง blood brain barrier');
F(5,'ns','เซลล์ค้ำจุนที่บุโพรงสมองและช่วยสร้าง CSF คืออะไร','Ependymal cell',['Astrocyte','Microglia','Oligodendrocyte'],'ependymal cell บุ ventricle และ central canal');

/* ===== บทที่ 6 · ตัวรับความรู้สึกและการบาดเจ็บไขสันหลัง ===== */
M(6,'sens','{a} ทำหน้าที่รับความรู้สึกใด','ตัวรับใดรับ{b}',[
 ['Free nerve endings','ความเจ็บปวดและอุณหภูมิ'],['Merkel disks','สัมผัสเบาและแรงกดตื้น ๆ'],['Hair follicle receptor','การขยับของเส้นขน'],
 ['Meissner corpuscles','สัมผัสเบาและการแยกสองจุด'],['Ruffini end organ','สัมผัสต่อเนื่องและแรงกดลึก'],['Pacinian corpuscle','แรงสั่นสะเทือนและแรงกดลึก'],
 ['Muscle spindle','ความยาวและความตึงของกล้ามเนื้อลาย'],['Golgi tendon organ','ความตึงของเอ็นกล้ามเนื้อ']
],'ตัวรับความรู้สึกทางกาย (somatic receptors) ส่งสัญญาณไปยัง first order neuron ที่ dorsal root ganglion');
F(6,'sens','ตัวเซลล์ของ first order sensory neuron อยู่ที่ใด','Dorsal root ganglion',['Ventral horn','Lateral horn','Thalamus'],'first order neuron มีตัวเซลล์อยู่ใน dorsal root ganglion');
F(6,'sens','ตัวรับความรู้สึกที่มีจำนวนมากที่สุดและกระจายทั่วร่างกายคือตัวใด','Free nerve endings',['Pacinian corpuscle','Meissner corpuscle','Muscle spindle'],'free nerve endings พบทั่วไป รับความเจ็บ อุณหภูมิ และคัน');
F(6,'sens','ความรู้สึกคันรับโดยตัวรับใด','Free nerve endings',['Pacinian corpuscle','Golgi tendon organ','Muscle spindle'],'free nerve endings รับเจ็บ อุณหภูมิ คัน');
F(6,'sens','ตัวรับที่มีลักษณะเป็นชั้นคล้ายหัวหอมผ่าซีกคือตัวใด','Pacinian corpuscle',['Meissner corpuscle','Merkel disk','Free nerve ending'],'Pacinian corpuscle มี capsule ซ้อนเป็นชั้น ๆ คล้ายหัวหอม อยู่ลึกในชั้น dermis');
F(6,'sens','Meissner corpuscle พบมากที่บริเวณใด','ปลายนิ้วมือและริมฝีปาก (ผิวหนังไม่มีขน)',['เอ็นกล้ามเนื้อ','ชั้นใต้ผิวหนังลึกของสะโพก','ภายในกล้ามเนื้อลาย'],'Meissner corpuscle อยู่ใน dermal papillae ของผิวไม่มีขน เช่น ปลายนิ้ว');
F(6,'sens','การรับรู้ตำแหน่งและการเคลื่อนไหวของร่างกายเรียกว่าอะไร','Proprioception',['Nociception','Thermoreception','Chemoreception'],'proprioception รับโดย muscle spindle, Golgi tendon organ และ joint receptor');
F(6,'sens','ตัวรับความรู้สึกเจ็บปวดเรียกว่าอะไร','Nociceptor',['Proprioceptor','Thermoreceptor','Photoreceptor'],'nociceptor ส่วนใหญ่เป็น free nerve endings');
F(6,'sens','ตัวรับความตึงที่อยู่ระหว่างกล้ามเนื้อกับเอ็นคือตัวใด','Golgi tendon organ',['Muscle spindle','Pacinian corpuscle','Merkel disk'],'Golgi tendon organ อยู่ที่รอยต่อกล้ามเนื้อกับเอ็น');
F(6,'sens','ตัวรับที่อยู่ภายในกล้ามเนื้อลายคือตัวใด','Muscle spindle',['Golgi tendon organ','Meissner corpuscle','Ruffini end organ'],'muscle spindle อยู่ขนานกับเส้นใยกล้ามเนื้อ รับการยืดของกล้ามเนื้อ');
F(6,'sens','เมื่อไขสันหลังถูกตัดขาด จะเกิดอัมพาตในระดับใด','ระดับที่ต่ำกว่าจุดที่ถูกตัดขาด',['ระดับที่สูงกว่าจุดที่ถูกตัดขาด','เฉพาะจุดที่ถูกตัดขาด','ทั้งร่างกายทุกระดับ'],'กระแสประสาทผ่านจุดที่บาดเจ็บไม่ได้ อวัยวะที่อยู่ต่ำกว่าจึงเป็นอัมพาต');
F(6,'sens','อัมพาตแขนขาทั้ง 4 ข้างเรียกว่าอะไร','Quadriplegia (tetraplegia)',['Paraplegia','Hemiplegia','Monoplegia'],'quadriplegia เกิดเมื่อไขสันหลังระดับคอบาดเจ็บ');
F(6,'sens','อัมพาตขาทั้ง 2 ข้าง แต่แขนยังใช้ได้ เรียกว่าอะไร','Paraplegia',['Quadriplegia','Hemiplegia','Monoplegia'],'paraplegia เกิดเมื่อไขสันหลังระดับอกหรือต่ำกว่าบาดเจ็บ');
F(6,'sens','อัมพาตครึ่งซีกซ้ายหรือขวาของร่างกายเรียกว่าอะไร','Hemiplegia',['Paraplegia','Quadriplegia','Monoplegia'],'hemiplegia มักเกิดจากรอยโรคในสมองด้านตรงข้าม');
F(6,'sens','ไขสันหลังระดับใดบาดเจ็บแล้วทำให้เกิด quadriplegia','ระดับคอ (cervical)',['ระดับอก (thoracic)','ระดับเอว (lumbar)','ระดับกระเบนเหน็บ (sacral)'],'ระดับคอเลี้ยงทั้งแขนและขา จึงอ่อนแรงทั้ง 4 ข้าง');
F(6,'sens','ไขสันหลังระดับใดบาดเจ็บแล้วทำให้เกิด paraplegia','ระดับอก (thoracic)',['ระดับคอส่วนบน (C1–C4)','ระดับก้านสมอง','ระดับ cerebral cortex'],'ระดับอกอยู่ต่ำกว่าเส้นประสาทแขน แขนจึงยังใช้ได้');
F(6,'sens','Thermoreceptor รับความรู้สึกใด','อุณหภูมิร้อนและเย็น',['แรงสั่นสะเทือน','ความตึงของเอ็น','แสง'],'thermoreceptor ส่วนใหญ่เป็น free nerve endings');
F(6,'sens','Merkel disk อยู่ในชั้นใดของผิวหนัง','ชั้นฐานของหนังกำพร้า (stratum basale)',['ชั้นไขมันใต้ผิวหนัง','ชั้นขี้ไคล (stratum corneum)','ภายในเอ็นกล้ามเนื้อ'],'Merkel disk อยู่ตื้นที่ฐานของ epidermis รับสัมผัสเบาและแรงกดตื้น');
F(6,'sens','ตัวรับใดรับแรงกดลึกและการสั่นสะเทือนความถี่สูงได้ดีที่สุด','Pacinian corpuscle',['Merkel disk','Free nerve ending','Hair follicle receptor'],'Pacinian corpuscle อยู่ลึก ตอบสนองต่อแรงสั่นสะเทือนเร็ว');

/* ===== บทที่ 7 · การรับกลิ่นและรส ===== */
F(7,'smell','เซลล์รับกลิ่นอยู่บริเวณใดของโพรงจมูก','เยื่อบุโพรงจมูกส่วนบน (olfactory epithelium)',['ส่วนล่างของโพรงจมูกใกล้รูจมูก','ไซนัสข้างจมูก','หลอดคอส่วนบน'],'olfactory epithelium อยู่บนหลังคาโพรงจมูก');
F(7,'smell','เซลล์รับกลิ่นมีอายุประมาณกี่วัน','30 วัน',['10 วัน','120 วัน','ตลอดชีวิต'],'เซลล์รับกลิ่นเปลี่ยนใหม่ทุกประมาณ 30 วัน');
F(7,'smell','เซลล์รับรสมีอายุประมาณกี่วัน','10 วัน',['30 วัน','1 วัน','120 วัน'],'เซลล์รับรสเปลี่ยนใหม่ทุกประมาณ 10 วัน');
F(7,'smell','เส้นประสาทที่นำกระแสประสาทรับกลิ่นคือเส้นใด','Olfactory nerve (CN I)',['Optic nerve (CN II)','Trigeminal nerve (CN V)','Facial nerve (CN VII)'],'CN I olfactory nerve รับกลิ่น');
F(7,'smell','ใยประสาทรับกลิ่นผ่านกะโหลกทางรูพรุนของกระดูกส่วนใด','Cribriform plate ของ ethmoid bone',['Foramen magnum ของ occipital bone','Sella turcica ของ sphenoid bone','Foramen ovale ของ sphenoid bone'],'olfactory nerve ทะลุ cribriform plate ไปยัง olfactory bulb');
F(7,'smell','ลำดับทางเดินกระแสประสาทรับกลิ่นข้อใดถูกต้อง','เซลล์รับกลิ่น → olfactory nerve → olfactory bulb → olfactory tract → สมอง',['เซลล์รับกลิ่น → olfactory tract → olfactory bulb → olfactory nerve → สมอง','olfactory bulb → เซลล์รับกลิ่น → olfactory nerve → olfactory tract → สมอง','เซลล์รับกลิ่น → olfactory bulb → olfactory nerve → thalamus → สมอง'],'เส้นทาง: receptor → CN I → bulb → tract → olfactory cortex');
F(7,'smell','ปุ่มเล็ก ๆ บนผิวลิ้นเรียกว่าอะไร','Papillae',['Taste pore','Cilia','Villi'],'ลิ้นมี papillae หลายชนิด taste bud อยู่ที่ผนังของ papillae');
F(7,'smell','ลิ้นมี taste bud ประมาณกี่ต่อม','3,000 ถึง 10,000 ต่อม',['100 ถึง 300 ต่อม','50,000 ถึง 100,000 ต่อม','ประมาณ 500 ต่อม'],'taste bud มีประมาณ 3,000 ถึง 10,000 ต่อม');
F(7,'smell','ศูนย์รับรสในสมองอยู่ที่ใด','Insular lobe (insula)',['Occipital lobe','Frontal lobe ส่วน Broca area','Cerebellum'],'gustatory cortex อยู่ที่ insula');
F(7,'smell','การรับรสจากลิ้นส่วนหน้า 2/3 นำโดยเส้นประสาทใด','Facial nerve (CN VII)',['Glossopharyngeal nerve (CN IX)','Vagus nerve (CN X)','Hypoglossal nerve (CN XII)'],'รสลิ้นหน้า 2/3 ไปทาง chorda tympani ของ CN VII');
F(7,'smell','การรับรสจากลิ้นส่วนหลัง 1/3 นำโดยเส้นประสาทใด','Glossopharyngeal nerve (CN IX)',['Facial nerve (CN VII)','Vagus nerve (CN X)','Trigeminal nerve (CN V)'],'ลิ้นหลัง 1/3 ใช้ CN IX');
F(7,'smell','การรับรสบริเวณเพดานอ่อนและหลอดคอ (epiglottis) นำโดยเส้นประสาทใด','Vagus nerve (CN X)',['Facial nerve (CN VII)','Glossopharyngeal nerve (CN IX)','Hypoglossal nerve (CN XII)'],'บริเวณคอหอยใช้ CN X');
F(7,'smell','Facial nerve (CN VII) รับรสจากบริเวณใด','ลิ้นส่วนหน้า 2/3',['ลิ้นส่วนหลัง 1/3','เพดานอ่อนและหลอดคอ','โพรงจมูกส่วนบน'],'จำว่า รสลิ้น 7 9 10');
F(7,'smell','Glossopharyngeal nerve (CN IX) รับรสจากบริเวณใด','ลิ้นส่วนหลัง 1/3',['ลิ้นส่วนหน้า 2/3','เพดานอ่อนและหลอดคอ','ปลายลิ้นอย่างเดียว'],'จำว่า รสลิ้น 7 9 10');
F(7,'smell','เส้นประสาทที่ควบคุมการเคลื่อนไหวของลิ้น (ไม่ใช่การรับรส) คือเส้นใด','Hypoglossal nerve (CN XII)',['Facial nerve (CN VII)','Glossopharyngeal nerve (CN IX)','Olfactory nerve (CN I)'],'CN XII เป็น motor ของกล้ามเนื้อลิ้น');
F(7,'smell','รสพื้นฐานที่ลิ้นรับได้มีกี่รส','5 รส คือ หวาน เค็ม เปรี้ยว ขม และอูมามิ',['4 รส คือ หวาน เค็ม เปรี้ยว ขม','3 รส คือ หวาน เค็ม เปรี้ยว','6 รส คือ หวาน เค็ม เปรี้ยว ขม เผ็ด และฝาด'],'รสพื้นฐาน 5 รส รวมอูมามิ ส่วนเผ็ดเป็นความรู้สึกเจ็บร้อน');
F(7,'smell','รูเปิดของ taste bud ที่สารละลายเข้าไปสัมผัสเซลล์รับรสเรียกว่าอะไร','Taste pore',['Papilla','Foramen','Crypt'],'สารที่ละลายในน้ำลายเข้า taste pore ไปจับ microvilli ของเซลล์รับรส');
F(7,'smell','สารที่จะรับรสได้ต้องอยู่ในสภาพใด','ละลายในน้ำลาย',['เป็นของแข็งแห้ง','เป็นก๊าซ','ละลายในไขมัน'],'สารต้องละลายในน้ำลายจึงเข้าสู่ taste pore ได้');
F(7,'smell','สารที่จะรับกลิ่นได้ต้องอยู่ในสภาพใด','ระเหยเป็นไอและละลายในเมือกของโพรงจมูก',['เป็นของแข็งแห้ง','ละลายในน้ำลาย','ละลายในเลือด'],'โมเลกุลกลิ่นระเหยเข้าจมูกแล้วละลายในเมือกเพื่อจับกับเซลล์รับกลิ่น');
F(7,'smell','การรับกลิ่นและรสจัดเป็นตัวรับชนิดใด','Chemoreceptor',['Mechanoreceptor','Photoreceptor','Thermoreceptor'],'กลิ่นและรสเป็นการรับสารเคมี');
F(7,'smell','ปุ่มลิ้นขนาดใหญ่เรียงเป็นรูปตัว V ที่โคนลิ้นเรียกว่าอะไร','Circumvallate (vallate) papillae',['Filiform papillae','Fungiform papillae','Foliate papillae'],'circumvallate papillae เรียงเป็นตัว V ด้านหน้าของ sulcus terminalis');
F(7,'smell','ปุ่มลิ้นชนิดใดมีมากที่สุดแต่ไม่มี taste bud','Filiform papillae',['Circumvallate papillae','Fungiform papillae','Foliate papillae'],'filiform papillae ช่วยเรื่องความสาก รับสัมผัส ไม่มี taste bud');
F(7,'smell','ปุ่มลิ้นรูปร่างคล้ายเห็ด กระจายที่ปลายและขอบลิ้นเรียกว่าอะไร','Fungiform papillae',['Filiform papillae','Circumvallate papillae','Foliate papillae'],'fungiform = รูปเห็ด มี taste bud');

/* gland เพิ่มเติม */
M(2,'gland','{a} จัดเป็นต่อมแบบใด','ข้อใดเป็นตัวอย่างของ {b}',[
 ['ต่อมในผนังลำไส้ใหญ่ (intestinal crypt)','Simple tubular gland'],['ต่อมเหงื่อ eccrine','Simple coiled tubular gland'],['ต่อมในกระเพาะอาหาร (gastric gland)','Simple branched tubular gland'],
 ['ต่อมไขมัน (sebaceous gland)','Simple branched alveolar gland'],['ต่อมน้ำนม (mammary gland)','Compound alveolar gland'],['ต่อมใต้ลิ้นและ submandibular gland','Compound tubuloalveolar gland'],
 ['Goblet cell','Unicellular gland']
],'แบ่งต่อมมีท่อตามรูปร่าง: simple หรือ compound และส่วนหลั่งเป็น tubular, alveolar หรือ tubuloalveolar');
M(2,'gland','{a} หลั่งฮอร์โมนหรือสารใด','ต่อมใดหลั่ง{b}',[
 ['ต่อมไทรอยด์','thyroxine (T4) และ triiodothyronine (T3)'],['ต่อมหมวกไตส่วนใน (adrenal medulla)','adrenaline (epinephrine)'],['Islets of Langerhans ของตับอ่อน','insulin และ glucagon'],
 ['ต่อมน้ำลาย parotid','น้ำลายที่มี amylase'],['ต่อมน้ำตา (lacrimal gland)','น้ำตา'],['ต่อมไขมัน','sebum'],['Goblet cell','mucin'],['ต่อมเหงื่อ eccrine','เหงื่อที่ช่วยระบายความร้อน']
],'ต่อมไร้ท่อหลั่งฮอร์โมนเข้าเลือด ต่อมมีท่อหลั่งสารผ่านท่อ');
F(2,'gland','ต่อมน้ำลายคู่ที่ใหญ่ที่สุดคือต่อมใด','Parotid gland',['Submandibular gland','Sublingual gland','Lacrimal gland'],'parotid ใหญ่ที่สุด อยู่หน้าหู สร้างน้ำลายแบบ serous');
F(2,'gland','ต่อมน้ำลายที่อยู่ใต้ลิ้นและสร้างเมือกเป็นหลักคือต่อมใด','Sublingual gland',['Parotid gland','Submandibular gland','Thyroid gland'],'sublingual gland สร้างน้ำลายแบบ mucous เป็นหลัก');
F(2,'gland','ต่อมน้ำลายมีกี่คู่ใหญ่','3 คู่ คือ parotid, submandibular และ sublingual',['2 คู่ คือ parotid และ sublingual','4 คู่ รวม lacrimal gland','1 คู่ คือ parotid'],'ต่อมน้ำลายใหญ่ 3 คู่');
F(2,'gland','เซลล์ในต่อมที่หดตัวช่วยบีบสารออกจากส่วนหลั่งเรียกว่าอะไร','Myoepithelial cell',['Goblet cell','Chondrocyte','Melanocyte'],'myoepithelial cell อยู่รอบส่วนหลั่งของต่อมเหงื่อ ต่อมน้ำลาย และต่อมน้ำนม');
F(2,'gland','ต่อมที่หลั่งสารออกฤทธิ์ต่อเซลล์ข้างเคียงโดยไม่ผ่านเลือด เรียกว่าการหลั่งแบบใด','Paracrine',['Endocrine','Exocrine','Holocrine'],'paracrine ออกฤทธิ์เฉพาะที่ต่อเซลล์ใกล้เคียง');
F(2,'gland','ต่อมไร้ท่อมีหลอดเลือดมาเลี้ยงมากหรือน้อย','มากเป็นพิเศษ เพราะหลั่งฮอร์โมนเข้าสู่เลือดโดยตรง',['น้อยมาก เพราะไม่ต้องใช้เลือด','ไม่มีหลอดเลือดเลย','เท่ากับกระดูกอ่อน'],'endocrine gland มีหลอดเลือดฝอยหนาแน่นรอบเซลล์');
F(2,'gland','Glandular epithelium เกิดจากการเปลี่ยนแปลงของเนื้อเยื่อใด','เยื่อบุผิว (covering epithelium) ที่งอกลึกลงไปในเนื้อเยื่อเกี่ยวพัน',['กล้ามเนื้อเรียบ','กระดูกอ่อน','เนื้อเยื่อประสาท'],'ต่อมเจริญจากเยื่อบุผิวที่งอกลงไป ถ้ายังมีท่อต่อกับผิวเป็น exocrine ถ้าท่อหายไปเป็น endocrine');
F(2,'gland','ถ้าท่อของต่อมที่กำลังเจริญสลายหายไป ต่อมนั้นจะกลายเป็นต่อมแบบใด','ต่อมไร้ท่อ (endocrine)',['ต่อมมีท่อ (exocrine)','ต่อมเซลล์เดียว','ต่อมแบบ holocrine'],'endocrine gland ไม่มีท่อเชื่อมกับผิว');
F(2,'gland','ต่อมเหงื่อจัดเป็นต่อมชนิดใดตามจำนวนเซลล์','Multicellular exocrine gland',['Unicellular gland','Endocrine gland','ต่อมเซลล์เดียวแบบ goblet'],'ต่อมเหงื่อมีหลายเซลล์และมีท่อ');
F(2,'gland','ตับอ่อนส่วนที่สร้างน้ำย่อยจัดเป็นต่อมแบบใด','Compound acinar exocrine gland',['Simple tubular gland','Unicellular gland','Endocrine gland'],'ส่วน exocrine ของตับอ่อนเป็น acinus สร้างน้ำย่อย ส่งผ่านท่อที่แตกแขนง');
})();
