import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Flame, Apple, Calculator, Award, Sparkles, 
  ChevronDown, ChevronUp, CheckCircle2, Phone, MessageSquare, 
  Instagram, Facebook, MapPin, Play, Pause, RotateCcw, 
  ArrowRight, ArrowLeft, Target, Activity, Heart, Shield, 
  TrendingUp, Users, Clock, Coffee, Zap, Info, Star, 
  Menu, X, ChevronRight, Share2, Download, Scale
} from 'lucide-react';

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dietTab, setDietTab] = useState('bulking'); // 'bulking' or 'cutting'
  const [activeDay, setActiveDay] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRule, setExpandedRule] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  // --- BMI Calculator State ---
  const [bmiWeight, setBmiWeight] = useState(75);
  const [bmiHeight, setBmiHeight] = useState(175);
  const [bmiResult, setBmiResult] = useState(null);

  // --- Calorie Calculator State ---
  const [calGender, setCalGender] = useState('male');
  const [calAge, setCalAge] = useState(24);
  const [calWeight, setCalWeight] = useState(75);
  const [calHeight, setCalHeight] = useState(178);
  const [calActivity, setCalActivity] = useState(1.55); // moderate
  const [calGoal, setCalGoal] = useState('bulk'); // 'bulk', 'cut', 'maintain'
  const [calResult, setCalResult] = useState(null);

  // --- Workout Timer State ---
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Sound beep via Web Audio API for timer completion
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const resetTimer = (sec = 60) => {
    setTimerRunning(false);
    setTimerInitial(sec);
    setTimerSeconds(sec);
  };

  // Calculate BMI
  const handleCalculateBMI = (e) => {
    e?.preventDefault();
    const hInMeters = bmiHeight / 100;
    const bmi = (bmiWeight / (hInMeters * hInMeters)).toFixed(1);
    let category = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      category = 'نحافة (تحت الوزن المثالي)';
      color = 'text-blue-400';
      advice = 'تحتاج إلى زيادة سعراتك الحرارية تدريجيًا والتركيز على تمارين المقاومة لزيادة الكتلة العضلية.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'وزن مثالي وصحي';
      color = 'text-emerald-400';
      advice = 'جسمك في نطاق صحي ممتاز! استمر في الالتزام بالتدريب والتغذية المتوازنة لتحسين تكوين الجسم.';
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'زيادة في الوزن';
      color = 'text-amber-400';
      advice = 'ينصح باتباع نظام تنشيف معتدل مع تمارين الكارديو وتدريب الأثقال لخسارة الدهون مع الحفاظ على العضلات.';
    } else {
      category = 'سمنة (كتلة دهون مرتفعة)';
      color = 'text-rose-400';
      advice = 'يجب وضع عجز سعرات حراري محسوب بدقة وزيادة النشاط اليومي تدريجيًا تحت إشراف وتوجيه كابتن عبدالرحيم.';
    }

    setBmiResult({ bmi, category, color, advice });
  };

  // Calculate Calories & Macros (Mifflin-St Jeor)
  const handleCalculateCalories = (e) => {
    e?.preventDefault();
    let bmr = 10 * calWeight + 6.25 * calHeight - 5 * calAge;
    if (calGender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = Math.round(bmr * calActivity);
    let targetCalories = tdee;

    if (calGoal === 'bulk') {
      targetCalories = tdee + 400;
    } else if (calGoal === 'cut') {
      targetCalories = tdee - 500;
    }

    // Macro breakdown based on goal
    let proteinGrams, carbsGrams, fatGrams;
    if (calGoal === 'bulk') {
      proteinGrams = Math.round((targetCalories * 0.30) / 4);
      carbsGrams = Math.round((targetCalories * 0.55) / 4);
      fatGrams = Math.round((targetCalories * 0.15) / 9);
    } else if (calGoal === 'cut') {
      proteinGrams = Math.round((targetCalories * 0.45) / 4);
      carbsGrams = Math.round((targetCalories * 0.35) / 4);
      fatGrams = Math.round((targetCalories * 0.20) / 9);
    } else {
      proteinGrams = Math.round((targetCalories * 0.35) / 4);
      carbsGrams = Math.round((targetCalories * 0.45) / 4);
      fatGrams = Math.round((targetCalories * 0.20) / 9);
    }

    setCalResult({
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
    });
  };

  // --- Static Data ---
  const workoutDays = [
    {
      day: 1,
      title: 'بنش + ظهر 1',
      subtitle: 'صدر علوي وقوة الظهر وسماكة العضلات',
      icon: '🏋️‍♂️',
      badge: 'الصدر والظهر (Chest & Back 1)',
      color: 'from-amber-500/20 to-yellow-600/10',
      exercises: [
        { name: 'دامبل عالي', enName: 'Incline DB Press', sets: '4 مجموعات × 8-12 عدة', target: 'الصدر العلوي', tip: 'حافظ على زاوية المقعد عند 30 درجة لتركيز الضغط على ألياف الصدر العلوية.' },
        { name: 'سحب عالي', enName: 'Lat Pulldown', sets: '4 مجموعات × 10-12 عدة', target: 'عضلات اللاتس (عرض الظهر)', tip: 'اسحب بالمرفقين لأسفل مع ثبات الجذع وعصر عضلات الظهر للخلف.' },
        { name: 'بار واطي', enName: 'Flat Barbell Bench Press', sets: '4 مجموعات × 6-10 عدات', target: 'منتصف الصدر والقوة العامة', tip: 'ثبت قدميك جيدًا في الأرض وحافظ على قوس خفيف وطبيعي بأسفل الظهر.' },
        { name: 'سحب أرضي ضيق', enName: 'Seated Cable Row (Close Grip)', sets: '4 مجموعات × 10-12 عدة', target: 'سماكة منتصف الظهر', tip: 'حافظ على استقامة الظهر واسحب المقبض لأسفل البطن مع ضم لوحي الكتف.' },
        { name: 'فراشة', enName: 'Pec Deck / Cable Fly', sets: '3 مجموعات × 12-15 عدة', target: 'عزل الصدر والخط الأوسط', tip: 'ركز على الانقباض الكامل في المنتصف مع ثني طفيف وثابت بالمرفق.' },
        { name: 'حبل ظهر', enName: 'Facepull / Rope Lat Pullover', sets: '3 مجموعات × 15 عدة', target: 'الكتف الخلفي والترابيس واللاتس', tip: 'اسحب الحبل باتجاه الجبهة لتفعيل الكتف الخلفي وحماية مفصل الكتف.' }
      ]
    },
    {
      day: 2,
      title: 'دراع 1',
      subtitle: 'أكتاف ثلاثية الأبعاد، بايسبس وترايسبس ضخم',
      icon: '💪',
      badge: 'الذراعين والأكتاف (Arms & Shoulders 1)',
      color: 'from-yellow-500/20 to-amber-700/10',
      exercises: [
        { name: 'دامبل 90°', enName: 'DB Shoulder Press (Seated 90°)', sets: '4 مجموعات × 8-10 عدات', target: 'الكتف الأمامي والجانبي', tip: 'لا تجعل المرفقين يخرجان بزاوية 180 درجة، بل اجعلهما للأمام قليلاً لحماية الأوتار.' },
        { name: 'رفرفة جانبي', enName: 'Lateral DB Raise', sets: '4 مجموعات × 12-15 عدة', target: 'الكتف الجانبي (عرض الكتف)', tip: 'ارفع الدامبل بالمرفق وليس بالمعصم، وتوقف عند مستوى الكتف.' },
        { name: 'رفرفة كيبل', enName: 'Cable Lateral Raise', sets: '3 مجموعات × 12-15 عدة', target: 'عزل الكتف الجانبي بتوتر مستمر', tip: 'الكابل يحافظ على التوتر العضلي طوال المدى الحركي حتى أسفل نقطة.' },
        { name: 'كتف خلفي', enName: 'Rear Delt Fly / Reverse Pec Deck', sets: '4 مجموعات × 15 عدة', target: 'الكتف الخلفي (3D Look)', tip: 'افرد الصدر وحرك الذراعين للخلف باستخدام عضلات الكتف الخلفي فقط.' },
        { name: 'باي كرسي', enName: 'Incline Dumbbell Bicep Curl', sets: '3 مجموعات × 10-12 عدة', target: 'الرأس الطويل للبايسبس (الإطالة الكاملة)', tip: 'اضبط المقعد بدرجة 45-60 ودع الذراعين تتمددان بالكامل قبل الرفع.' },
        { name: 'تراي خلفي', enName: 'Overhead Tricep Extension', sets: '3 مجموعات × 10-12 عدة', target: 'الرأس الطويل للترايسبس', tip: 'ثبت الكوعين بالقرب من الرأس ولا تدعهما يفتحان للخارج أثناء النزول.' },
        { name: 'باي ارتكاز', enName: 'Concentration / Preacher Curl', sets: '3 مجموعات × 12 عدة', target: 'قمة البايسبس وعزله التام', tip: 'ثبت المرفق على الفخذ واعتمد على عضلات الباي فقط دون تأرجح الجسم.' },
        { name: 'تراي حبل', enName: 'Tricep Rope Pushdown', sets: '4 مجموعات × 12-15 عدة', target: 'الرأس الجانبي للتراي (حدوة الحصان)', tip: 'افتح الحبل عند أسفل الحركة واعصر الترايسبس لمدة ثانية كاملة.' }
      ]
    },
    {
      day: 3,
      title: 'رجل 1',
      subtitle: 'قوة الأرجل، أوتار الركبة، السمانة والساعد',
      icon: '🦵',
      badge: 'الأرجل والجزء السفلي 1 (Legs & Forearms 1)',
      color: 'from-amber-600/20 to-yellow-500/10',
      exercises: [
        { name: 'سكواد', enName: 'Barbell Squat', sets: '4 مجموعات × 6-10 عدات', target: 'عضلات الفخذ الأمامية والخلفية والمقعدة', tip: 'انزل حتى يوازي فخذك الأرض مع الحفاظ على استقامة الصدر والعمود الفقري.' },
        { name: 'خلفي', enName: 'Lying Leg Curls (Hamstrings)', sets: '4 مجموعات × 10-12 عدة', target: 'عضلات الفخذ الخلفية (Hamstrings)', tip: 'اثنِ ركبتيك بالكامل مع النزول ببطء في 3 ثوانٍ لتحفيز التضخيم.' },
        { name: 'أمامي', enName: 'Leg Extension', sets: '4 مجموعات × 12-15 عدة', target: 'عزل وتقسيم الفخذ الأمامي (Quads)', tip: 'توقف ثانية في القمة عند فرد الساقين بالكامل مع عدم ارتداد الأوزان.' },
        { name: 'ديدليفت', enName: 'Romanian / Conventional Deadlift', sets: '4 مجموعات × 6-8 عدات', target: 'السلسلة الخلفية، الظهر السفلي وأوتار الركبة', tip: 'ادفع المؤخرة للخلف واجعل البار ملامسًا لسيقانك طوال الحركة.' },
        { name: 'سمانة', enName: 'Standing Calf Raise', sets: '4 مجموعات × 15-20 عدة', target: 'عضلة السمانة (Gastrocnemius)', tip: 'توقف ثانية في قمة الانقباض وثانية في أسفل الإطالة لأقصى نمو.' },
        { name: 'ساعد', enName: 'Forearm Wrist Curls', sets: '3 مجموعات × 15-20 عدة', target: 'قوة الساعد وقبضة اليد', tip: 'قم بلف المعصم للأعلى والأسفل بحركة محكومة مع تثبيت الذراعين.' }
      ]
    },
    {
      day: 4,
      title: 'بنش + ظهر 2',
      subtitle: 'زوايا ضخ جديدة لقمة الصدر وعمق عضلات الظهر',
      icon: '🔥',
      badge: 'الصدر والظهر (Chest & Back 2)',
      color: 'from-amber-500/20 to-yellow-600/10',
      exercises: [
        { name: 'بار عالي', enName: 'Incline Barbell Bench Press', sets: '4 مجموعات × 8-10 عدات', target: 'قوة وحجم الصدر العلوي', tip: 'انزل بالبار باتجاه أعلى عظمة القص مع كوعين بزاوية 45 درجة.' },
        { name: 'T-Bar', enName: 'T-Bar Row', sets: '4 مجموعات × 8-12 عدة', target: 'عمق وسمانة منتصف وأسفل الظهر', tip: 'حافظ على زاوية ميل الجذع 45 درجة واسحب الوزن بكتفيك وظهرك.' },
        { name: 'دامبل واطي', enName: 'Flat Dumbbell Press', sets: '4 مجموعات × 8-12 عدة', target: 'الصدر الأوسط وكثافة العضلة', tip: 'احصل على إطالة ممتازة في الأسفل واضغط الدامبلز للأعلى دون أن تتلامس بعنف.' },
        { name: 'سحب عالي ضيق', enName: 'Close Grip Lat Pulldown (V-Bar)', sets: '4 مجموعات × 10-12 عدة', target: 'أسفل اللاتس وعرض الظهر', tip: 'اسحب المقبض لمنتصف الصدر مع إرجاع الكتفين للخلف وإمالة طفيفة.' },
        { name: 'كيبل بنش', enName: 'Cable Crossover / Low to High Fly', sets: '3 مجموعات × 12-15 عدة', target: 'تحديد أسفل وأعلى الصدر', tip: 'اضبط الكابل واسحب بحركة دائرية تشبه العناق لضمان تدفق الدم.' },
        { name: 'One Hand Row', enName: 'One Arm Dumbbell Row', sets: '3 مجموعات × 10-12 عدة لكل جهة', target: 'عزل جهتي الظهر ومعالجة عدم التناسق', tip: 'اسحب الدامبل باتجاه الجيب الخلفي للبنطال لعصر عضلة اللاتس بأقصى كفاءة.' }
      ]
    },
    {
      day: 5,
      title: 'دراع 2',
      subtitle: 'تفجير الذراع والأكتاف بالكامل بأساليب مكثفة',
      icon: '⚡',
      badge: 'الذراعين والأكتاف 2 (Arms & Shoulders 2)',
      color: 'from-yellow-500/20 to-amber-700/10',
      exercises: [
        { name: 'كتف أمامي', enName: 'Front Dumbbell / Barbell Raise', sets: '3 مجموعات × 12 عدة', target: 'عضلة الكتف الأمامي', tip: 'ارفع الوزن ببطء حتى مستوى العين مع منع تأرجح الظهر.' },
        { name: 'رفرفة دامبل', enName: 'Standing DB Lateral Raise (Strict)', sets: '4 مجموعات × 12-15 عدة', target: 'الكتف الجانبي وعرض الجسم', tip: 'استخدم وزنًا متوسطًا وتحكم بنسبة 100% في مسار الحركة.' },
        { name: 'كتف خلفي', enName: 'Face Pull / High Cable Row', sets: '4 مجموعات × 15 عدة', target: 'الكتف الخلفي وأعلى الظهر', tip: 'افصل يديك في نهاية السحب للخارج بجانب الأذنين.' },
        { name: 'ترابيس', enName: 'Dumbbell / Barbell Shrugs', sets: '4 مجموعات × 12-15 عدة', target: 'عضلات الترابيزيوس (Traps)', tip: 'ارفع كتفيك باتجاه أذنيك للأعلى مباشرة دون تدوير الكتف لتجنب الإصابة.' },
        { name: 'باي خلفي', enName: 'Incline Hammer Curl / Drag Curl', sets: '3 مجموعات × 10-12 عدة', target: 'عضلة البراكيلس والرأس الطويل', tip: 'اجعل الإبهام متجهًا لأعلى طوال مسار الرفع للحصول على ذراع أكثر سمكًا.' },
        { name: 'تراي خلفي', enName: 'Lying Tricep Extension (Skullcrushers)', sets: '3 مجموعات × 10-12 عدة', target: 'الرأس الطويل والمتوسط للترايسبس', tip: 'انزل بالبار خلف الجبهة قليلاً للحفاظ على التوتر العضلي المستمر.' },
        { name: 'باي ارتكاز', enName: 'Preacher Bench Bicep Curl', sets: '3 مجموعات × 10-12 عدة', target: 'عزل البايسبس ومنع الغش بالكتف', tip: 'لا تقم بفرد المفصل 100% بعنف في القاع لتجنب إجهاد الأوتار.' },
        { name: 'باي بار', enName: 'Standing EZ Barbell Curl', sets: '3 مجموعات × 8-10 عدات', target: 'الحجم والقوة الشاملة للبايسبس', tip: 'ثبت كوعيك بجانب خصرك واثنِ ذراعيك بقوة للأعلى.' },
        { name: 'تراي كيبل', enName: 'Single Arm / Straight Bar Cable Pushdown', sets: '3 مجموعات × 12-15 عدة', target: 'ضخ الدم وعزل التراي بالكامل', tip: 'توقف لعصر العضلة مع كل تكرار لإنهاء التمرين بأعلى بمب (Pump).' }
      ]
    },
    {
      day: 6,
      title: 'رجل 2',
      subtitle: 'قوة الدفع، الأرجل، الضامة والسمانة وعضلات البطن',
      icon: '🛡️',
      badge: 'الأرجل والبطن (Legs, Adductors & Core 2)',
      color: 'from-amber-600/20 to-yellow-500/10',
      exercises: [
        { name: 'مكبس', enName: 'Leg Press Machine', sets: '4 مجموعات × 10-12 عدة', target: 'الفخذ الرباعي والأرداف بأوزان ثقيلة', tip: 'ضع قدميك بعرض الكتفين في منتصف المنصة ولا تقفل مفصل الركبة تمامًا في الأعلى.' },
        { name: 'خلفي', enName: 'Seated Hamstring Leg Curl', sets: '4 مجموعات × 12-15 عدة', target: 'عزل أوتار الركبة الخلفية', tip: 'ثبت وسادة الفخذ بإحكام واسحب الكعبين لأسفل وأسفل المقعد بقوة.' },
        { name: 'أمامي', enName: 'Leg Extension (Dropset)', sets: '3 مجموعات × 12 + دروب سيت', target: 'حرق الفخذ الأمامي وزيادة التحديد', tip: 'في المجموعة الأخيرة قلل الوزن 30% وأكمل حتى الفشل العضلي الإيجابي.' },
        { name: 'ضامة', enName: 'Hip Adductor Machine', sets: '3 مجموعات × 15 عدة', target: 'عضلات الفخذ الداخلية (الضامة)', tip: 'حركة بطيئة عند الفتح والانغلاق مع عصر العضلات لتقوية ثبات الحوض.' },
        { name: 'سمانة', enName: 'Seated Calf Raise', sets: '4 مجموعات × 15-20 عدة', target: 'عضلة السمانة العميقة (Soleus)', tip: 'التمرين جالسًا يركز على عضلة السوليس العميقة لتضخيم سمانة القدم من الأسفل.' },
        { name: 'بطن', enName: 'Hanging Leg Raise & Cable Crunch', sets: '4 مجموعات × 15-20 عدة', target: 'عضلات البطن السفلية والعلوية والجذع', tip: 'اثنِ الحوض للأعلى وازفر الهواء تمامًا في نهاية الحركة لتشغيل عضلات البطن.' }
      ]
    }
  ];

  // 30 Fitness Rules in Arabic
  const fitnessRules = [
    { id: 1, title: 'الاستمرارية هي سر التحول', category: 'عقلية', text: 'أفضل جدول تمارين في العالم لا قيمة له بدون الاستمرار لمدة 6 إلى 12 شهرًا على الأقل دون انقطاع عشوائي.' },
    { id: 2, title: 'الزيادة التدريجية في الأحمال (Progressive Overload)', category: 'تدريب', text: 'عضلاتك لن تنمو إلا إذا زادت الشدة عبر الزمن: إما بزيادة الوزن، زيادة العدات، زيادة المجموعات، أو تحسين التكنيك وتقليل وقت الراحة.' },
    { id: 3, title: 'البروتين هو حجر الأساس للبناء', category: 'تغذية', text: 'احرص على تناول 1.6 إلى 2.2 غرام بروتين لكل كيلوغرام من وزن جسمك يوميًا مقسمة على 4-5 وجبات متوازنة.' },
    { id: 4, title: 'النوم العميق هو مصنع الهرمونات', category: 'استشفاء', text: 'هرمون النمو (GH) وتخليق البروتين العضلي يعملان بأعلى كفاءة أثناء النوم العميق لمدة 7-9 ساعات ليلاً.' },
    { id: 5, title: 'التكنيك الصحيح يسبق الوزن الثقيل دائمًا', category: 'تدريب', text: 'رفع وزن ثقيل بتكنيك خاطئ يغذي غرورك لكنه يهلك مفاصلك وأوتارك، بينما التكنيك السليم يعزل العضلة ويبنيها بأمان.' },
    { id: 6, title: 'المدى الحركي الكامل (Full Range of Motion)', category: 'تدريب', text: 'النزول الكامل والصعود الكامل يعرض الألياف العضلية لأقصى إطالة وانقباض، مما يضاعف الإشارات المحفزة للنمو.' },
    { id: 7, title: 'الماء هو المحرك الصامت للأداء', category: 'تغذية', text: 'انخفاض نسبة الماء في جسمك بنسبة 2% فقط قد يقلل من قوتك وطاقتك في الجيم بنسبة تصل إلى 15%. اشرب 3-4 لتر يوميًا.' },
    { id: 8, title: 'الكاربوهيدرات ليست عدوك', category: 'تغذية', text: 'الكاربوهيدرات المعقدة هي وقود الجليكوجين في عضلاتك؛ بدونها ستشعر بالإرهاق وتفقد القدرة على رفع الأوزان بكفاءة.' },
    { id: 9, title: 'الدهون الصحية هرمون الذكورة الطبيعي', category: 'تغذية', text: 'الدهون الصحية من زيت الزيتون والمكسرات والأفوكادو ضرورية لإنتاج هرمون التستوستيرون وامتصاص الفيتامينات الذائبة في الدهون.' },
    { id: 10, title: 'وجبة ما قبل التمرين وقود أدائك', category: 'تغذية', text: 'تناول وجبة غنية بالكاربوهيدرات سريعة/متوسطة الامتصاص وبروتين خفيف قبل التمرين بـ 60-90 دقيقة لتحصل على طاقة متفجرة.' },
    { id: 11, title: 'الإحماء الديناميكي يحميك من الانتكاسات', category: 'تدريب', text: 'لا تبدأ بأوزان ثقيلة فورًا؛ قم بتمارين الإطالة الحركية وإحماء المفاصل ومجموعات خفيفة متدرجة لتنشيط الجهاز العصبي.' },
    { id: 12, title: 'الاتصال العقلي العضلي (Mind-Muscle Connection)', category: 'تدريب', text: 'ركز ذهنك في العضلة المستهدفة أثناء الحركة، وتخيل انقباضها وانبساطها؛ هذا يزيد من تجنيد الألياف العضلية بنسبة مثبتة علميًا.' },
    { id: 13, title: 'لا تهمل يوم الأرجل أبدًا', category: 'تدريب', text: 'تمارين الأرجل المركبة (كالسكوات والديدليفت) تحفز إفراز الهرمونات البنائية وتمنح جسمك مظهرًا متناسقًا وقوة جذرية لا غنى عنها.' },
    { id: 14, title: 'التحكم في المرحلة السلبية (Eccentric Phase)', category: 'تدريب', text: 'النزول بالوزن ببطء (2-3 ثوانٍ) يسبب تمزقات ميكروسكوبية إيجابية ومحفزة للتضخيم أكثر من مجرد رفع الوزن بسرعة.' },
    { id: 15, title: 'الكرياتين هو الملك بين المكملات', category: 'مكملات', text: 'الكرياتين مونوهيدرات (Creatine Monohydrate) هو أكثر مكمل مدروس علميًا لزيادة مخازن الطاقة ATP، القوة والحجم العضلي.' },
    { id: 16, title: 'عجز السعرات هو القانون الوحيد لخسارة الدهون', category: 'تغذية', text: 'مهما مارست من تمارين، لن تخسر دهونك إلا إذا كان ما تستهلكه من سعرات أقل مما يحرقه جسمك يوميًا بحساب دقيق.' },
    { id: 17, title: 'الفائض المحسوب هو سر التضخيم النظيف (Lean Bulk)', category: 'تغذية', text: 'لتضخيم العضلات بأقل نسبة دهون، يكفيك فائض 300-500 سعرة حرارية فوق احتياجك، ولا تفرط في الأكل العشوائي.' },
    { id: 18, title: 'أيام الراحة تنمو فيها العضلات، وليس داخل الجيم', category: 'استشفاء', text: 'في الجيم أنت تهدم الألياف، وفي الراحة مع التغذية يبني الجسم أليافًا أقوى وأكبر. احترم أيام الراحة كاحترامك لأيام التدريب.' },
    { id: 19, title: 'الكارديو لصحة القلب وليس فقط لحرق الدهون', category: 'تدريب', text: '20-30 دقيقة كارديو منخفض إلى متوسط الشدة 3 مرات أسبوعيًا يحسن كفاءة القلب ويساعد في سرعة التعافي بين المجموعات.' },
    { id: 20, title: 'تتبع أوزانك وتكراراتك في مفكرة أو تطبيق', category: 'تدريب', text: 'الاعتماد على الذاكرة يجعلك تراوح مكانك؛ اكتب ما رفعته اليوم لتتحدى نفسك وتكسر رقمك في الأسبوع القادم.' },
    { id: 21, title: 'لا تقارن بدايتك بمواسم حصاد الآخرين', category: 'عقلية', text: 'الأجسام تختلف في الجينات وسنوات التدريب؛ ركز في صورتك في المرآة وقارن نفسك فقط بنسختك في الشهر الماضي.' },
    { id: 22, title: 'الألياف الغذائية سر صحة الأمعاء وامتصاص الغذاء', category: 'تغذية', text: 'الخضروات الورقية والشوفان يحافظان على كفاءة الجهاز الهضمي، مما يضمن امتصاص جسمك للبروتينات والمغذيات بدون انتفاخات.' },
    { id: 23, title: 'ابتعد عن الإجهاد والتوتر الزائد (Cortisol Control)', category: 'استشفاء', text: 'ارتفاع هرمون الكورتيزول المستمر يعيق البناء العضلي ويزيد من تخزين الدهون في منطقة البطن؛ مارس التنفس العميق والهدوء.' },
    { id: 24, title: 'المكملات الغذائية مكملة وليست سحرية', category: 'مكملات', text: 'الواي بروتين والفيتامينات صممت لسد النقص في نظامك؛ لن تعوضك عن وجبات حقيقية مطبوخة بعناية وحساب دقيق.' },
    { id: 25, title: 'التنفس الصحيح أثناء التمرين يمنع هبوط الضغط', category: 'تدريب', text: 'ازفر الهواء (زفير) في مرحلة بذل المجهود والدفع، واستنشق الهواء (شهيق) في مرحلة النزول والتحكم بالوزن.' },
    { id: 26, title: 'تقسيم الوجبات يعزز استمرار تدفق الأحماض الأمينية', category: 'تغذية', text: 'تناول وجبة بروتينية كل 3-4 ساعات يحافظ على تحفيز مسار البناء العضلي (mTOR) على مدار اليوم.' },
    { id: 27, title: 'قوة القبضة وعضلات الجذع تحميك من الإصابات الكبرى', category: 'تدريب', text: 'تقوية الساعدين والبطن والقطنية يعطيك أساسًا صلبًا كالصخر عند أداء تمارين القوة كالبنش بريس والسكوات.' },
    { id: 28, title: 'التدرج في التنشيف يحافظ على كل غرام عضلي', category: 'تغذية', text: 'لا تقطع السعرات فجأة بنسب قاسية؛ النزول التدريجي بمعدل 0.5-1 كجم دهون أسبوعيًا يضمن احتفاظك بالحجم العضلي المكتسب.' },
    { id: 29, title: 'أسبوع تفريغ الأحمال (Deload Week) ضرورة دورية', category: 'استشفاء', text: 'كل 8 إلى 10 أسابيع من التمرين الشاق، خصص أسبوعًا تقلل فيه الأوزان والمجموعات بنسبة 50% لراحة المفاصل والجهاز العصبي.' },
    { id: 30, title: 'بناء الأجسام رحلة حياة وتغيير سلوك مستمر', category: 'عقلية', text: 'اللياقة ليست مرحلة مؤقتة لحدث معين، بل هي أسلوب حياة يعلمك الانضباط، الصبر، القوة، وبناء شخصيتك قبل عضلاتك.' }
  ];

  // Filtered workouts
  const currentWorkout = workoutDays.find((d) => d.day === activeDay);

  return (
    <div className="min-h-screen bg-[#090909] text-white font-['Cairo',sans-serif] selection:bg-amber-500 selection:text-black antialiased relative overflow-x-hidden" dir="rtl">
      
      {/* Dynamic Background Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[-15%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[150px]"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- Sticky Navigation Bar --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#090909]/80 border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Brand */}
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-[2px] shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#090909] rounded-2xl flex items-center justify-center">
                  <span className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                    BodA
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-wider text-white flex items-center gap-1">
                  BodA <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 font-normal">PRO</span>
                </span>
                <span className="text-[10px] text-amber-300/80 font-semibold tracking-widest uppercase">
                  Build Your Self
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <a href="#hero" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">الرئيسية</a>
              <a href="#about" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">من هو الكابتن</a>
              <a href="#workout" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">جدول التمارين</a>
              <a href="#nutrition" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">الأنظمة الغذائية</a>
              <a href="#foodguide" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">دليل الأطعمة</a>
              <a href="#recipes" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">وصفات الشوفان</a>
              <a href="#preworkout" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">مقال الطاقة</a>
              <a href="#rules" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">30 قاعدة</a>
              <a href="#calculators" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">الحاسبات</a>
              <a href="#contact" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all">تواصل معنا</a>
            </div>

            {/* CTA Buttons Header */}
            <div className="hidden sm:flex items-center gap-3">
              <a 
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20BodA%20%D8%A7%D9%84%D8%AA%D8%AF%D8%B1%D9%8A%D8%A8%D9%8A" 
                target="_blank" 
                rel="noreferrer"
                className="relative group overflow-hidden rounded-xl p-[1px] font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-xl transition-all duration-300 group-hover:opacity-90"></div>
                <div className="relative px-5 py-2.5 bg-[#090909] rounded-[11px] transition-all duration-300 group-hover:bg-transparent flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-black transition-colors" />
                  <span className="text-sm text-white group-hover:text-black font-bold">ابدأ الآن</span>
                </div>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0c0c0f]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-3 animate-fadeIn">
            <a onClick={() => setMobileMenuOpen(false)} href="#hero" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">الرئيسية</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#about" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">من هو الكابتن عبدالرحيم</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#workout" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">جدول التمارين 6 أيام</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#nutrition" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">الأنظمة الغذائية والماكروز</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#foodguide" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">دليل الأطعمة الشامل</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#recipes" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">وصفات الشوفان</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#preworkout" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">مقال ما قبل التمرين</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#rules" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">30 قاعدة للياقة</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#calculators" className="block py-2 text-base text-gray-200 hover:text-amber-400 border-b border-white/5">حاسبة السعرات و BMI</a>
            <a onClick={() => setMobileMenuOpen(false)} href="#contact" className="block py-2 text-base text-gray-200 hover:text-amber-400">تواصل معنا</a>
            <div className="pt-4">
              <a 
                href="https://wa.me/201000000000" 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>اشترك الآن مع الكابتن</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Column: Hero Copy & Actions */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-right">
              
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent border border-amber-500/30 backdrop-blur-md">
                <Award className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide">
                  🏆 منصة التدريب الرياضي الاحترافي الأولى
                </span>
              </div>

              {/* Main Brand Title */}
              <div className="space-y-3">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white">
                  Bod<span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">A</span>
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-300 tracking-widest uppercase">
                  Build Your Self
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                  <span className="h-[2px] w-12 bg-amber-500 rounded-full"></span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-400">
                    كابتن عبدالرحيم | Coach Abdelrahim
                  </span>
                  <span className="h-[2px] w-12 bg-amber-500 rounded-full"></span>
                </div>
              </div>

              {/* Sub-description */}
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                انضم إلى المنظومة التدريبية الأكثر تطورًا لبناء كتلة عضلية نقية، التنشيف الحاد، وزيادة القوة البدنية بأحدث البرامج العلمية والتغذية المحسوبة بدقة لكل هدف.
              </p>

              {/* CTA Buttons Array */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl mx-auto lg:mx-0">
                <a 
                  href="#contact"
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 text-black" />
                  <span className="text-sm sm:text-base">ابدأ الآن</span>
                </a>

                <a 
                  href="#workout"
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white font-bold transition-all duration-300 hover:scale-105"
                >
                  <Dumbbell className="w-5 h-5 text-amber-400" />
                  <span className="text-sm sm:text-base">جدول التمارين</span>
                </a>

                <a 
                  href="#nutrition"
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white font-bold transition-all duration-300 hover:scale-105"
                >
                  <Apple className="w-5 h-5 text-amber-400" />
                  <span className="text-sm sm:text-base">النظام الغذائي</span>
                </a>

                <a 
                  href="#contact"
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-white font-bold transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span className="text-sm sm:text-base">تواصل معنا</span>
                </a>
              </div>

              {/* Mini Social Proof */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-400">
                <div className="flex -space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-xs ring-2 ring-[#090909]">🏆</div>
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs ring-2 ring-[#090909]">💪</div>
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold text-xs ring-2 ring-[#090909]">⚡</div>
                </div>
                <span>انضم لأكثر من <strong className="text-amber-400 font-bold">+1000 بطل</strong> تم تغيير أجسامهم بنجاح</span>
              </div>

            </div>

            {/* Left Column: Hero Coach Showcase Badge Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Circular Rotating Accent */}
              <div className="absolute inset-0 m-auto w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-amber-500/20 animate-[spin_20s_linear_infinite] pointer-events-none"></div>
              <div className="absolute inset-0 m-auto w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-yellow-400/20 pointer-events-none"></div>

              {/* Main Premium Card */}
              <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent p-[1px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="bg-[#0e0e13]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 relative overflow-hidden">
                  
                  {/* Decorative Corner Glow */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>

                  {/* Coach Avatar/Emblem Center */}
                  <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <div className="w-full h-full rounded-full bg-[#14141b] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                      <div className="text-5xl sm:text-6xl mb-1">👑</div>
                      <span className="text-amber-400 font-extrabold text-sm sm:text-base">BodA Coach</span>
                      <span className="text-gray-300 text-xs font-semibold">عبدالرحيم</span>
                    </div>
                  </div>

                  {/* Quick Highlight Stats inside Hero Card */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                      <div className="text-xl font-black text-amber-400">+1000</div>
                      <div className="text-xs text-gray-400 font-medium">متدرب معتمد</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                      <div className="text-xl font-black text-amber-400">100%</div>
                      <div className="text-xs text-gray-400 font-medium">خطط مخصصة</div>
                    </div>
                  </div>

                  {/* Live Status Pill */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-amber-500/20 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-xs text-gray-300 font-semibold">المتابعة الأونلاين متاحة الآن</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                      دفعة جديدة
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 relative z-10 border-t border-white/5 bg-[#0b0b0f]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
              المدرب الشخصي والمستشار الرياضي
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              من هو الكابتن <span className="text-amber-400">عبدالرحيم؟</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              مدرب متخصص في بناء العضلات، التضخيم، التنشيف، تحسين اللياقة البدنية، ووضع أنظمة غذائية احترافية تناسب جميع المستويات.
            </p>
          </div>

          {/* 4 Main Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Users className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors">
                +1000
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">أكثر من 1000 متدرب</h3>
              <p className="text-sm text-gray-400">قصص نجاح حقيقية وتحولات بدنية شاملة من مختلف الأعمار والمستويات.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors">
                خبرة
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">خبرة تدريبية واسعة</h3>
              <p className="text-sm text-gray-400">سنوات من الممارسة والاطلاع على أحدث الأبحاث العلمية في التغذية والتدريب.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Apple className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors">
                100%
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">برامج غذائية مخصصة</h3>
              <p className="text-sm text-gray-400">أنظمة طعام مرنة محسوبة السعرات والماكروز تناسب ميزانيتك وأكلك المفضل.</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 group shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Clock className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors">
                24/7
              </div>
              <h3 className="text-lg font-bold text-gray-200 mb-2">متابعة مستمرة</h3>
              <p className="text-sm text-gray-400">تواصل مباشر عبر الواتساب للإجابة عن أسئلتك وتعديل الخطط بصفة دورية.</p>
            </div>

          </div>

          {/* Philosophy Pillars */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-white/[0.02] to-yellow-500/10 border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-1">دقة في الحساب</h4>
                <p className="text-sm text-gray-400">لا مكان للعشوائية؛ كل تمرين وكل غرام طعام موضوع لخدمة هدفك المحدد.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-1">أمان المفاصل والأوتار</h4>
                <p className="text-sm text-gray-400">التركيز الصارم على التكنيك الصحيح لضمان استمرارية تطورك وتفادي الإصابات.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-400/20 rounded-xl text-amber-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-1">تطور مستدام</h4>
                <p className="text-sm text-gray-400">نبني معك عادات صحية رياضية تدوم مدى الحياة لتصنع أفضل نسخة من نفسك.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- WORKOUT PROGRAM SECTION (6 DAYS) --- */}
      <section id="workout" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              الخطة التدريبية الاحترافية
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              جدول التمارين <span className="text-amber-400">(6 أيام)</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              تقسيم ذكي ومدروس يضمن استهداف جميع الزوايا العضلية بأعلى كفاءة مع منح كل مجموعة الوقت الكافي للاستشفاء والنمو.
            </p>
          </div>

          {/* Days Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {workoutDays.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                  activeDay === d.day
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
                }`}
              >
                <span>{d.icon}</span>
                <span>اليوم {d.day}: {d.title}</span>
              </button>
            ))}
          </div>

          {/* Active Workout Day Display Card */}
          {currentWorkout && (
            <div className="bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-[1px] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-2xl">
              <div className="bg-[#0e0e14]/90 p-6 sm:p-10 rounded-3xl space-y-8">
                
                {/* Header of Active Day */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="inline-block px-3 py-1 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20 mb-1">
                      {currentWorkout.badge}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3">
                      <span>{currentWorkout.icon}</span>
                      <span>اليوم {currentWorkout.day} - {currentWorkout.title}</span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">{currentWorkout.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                      href="#calculators"
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 hover:text-amber-400 hover:border-amber-400 transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>مؤقت الراحة</span>
                    </a>
                  </div>
                </div>

                {/* Exercises Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentWorkout.exercises.map((ex, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs group-hover:bg-amber-500 group-hover:text-black transition-colors">
                          0{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-300/90 bg-amber-400/10 px-2.5 py-1 rounded-md">
                          {ex.target}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                          {ex.name}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono" dir="ltr">
                          {ex.enName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{ex.sets}</span>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed pt-1 border-t border-white/5">
                        💡 <strong className="text-gray-300 font-semibold">توجيه الكابتن:</strong> {ex.tip}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pro Routine Note */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3 text-xs sm:text-sm text-gray-300">
                  <Info className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>ملاحظة الكابتن عبدالرحيم:</strong> خذ راحة 60-90 ثانية بين المجموعات المركبة و45 ثانية بين تمارين العزل، وحافظ على تسجيل أوزانك بانتظام لتطبيق الزيادة التدريبية.
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* --- NUTRITION & DIET PLANS SECTION --- */}
      <section id="nutrition" className="py-24 relative z-10 bg-[#0b0b10]/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              الأنظمة الغذائية الدقيقة
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              برامج التغذية <span className="text-amber-400">الاحترافية</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              اختر هدفك الحالي لاستعراض تقسيم الوجبات وتوقيتها المثالي على مدار اليوم لضمان أعلى طاقة وأفضل نتائج عضلية.
            </p>
          </div>

          {/* Bulking vs Cutting Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-2 max-w-md w-full">
              <button
                onClick={() => setDietTab('bulking')}
                className={`flex-1 py-3.5 rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  dietTab === 'bulking'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Flame className="w-5 h-5" />
                <span>💪 نظام التضخيم (Bulking)</span>
              </button>
              
              <button
                onClick={() => setDietTab('cutting')}
                className={`flex-1 py-3.5 rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  dietTab === 'cutting'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>🔥 نظام التنشيف (Cutting)</span>
              </button>
            </div>
          </div>

          {/* Diet Meals Cards */}
          {dietTab === 'bulking' ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <span className="font-bold text-amber-300 text-sm sm:text-base">
                  ⚡ هدف نظام التضخيم: بناء أقصى كتلة عضلية نقية مع فائض سعرات مدروس ومخازن جليكوجين ممتلئة.
                </span>
                <span className="text-xs bg-amber-400 text-black font-extrabold px-3 py-1 rounded-lg">
                  فائض +400 سعرة
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Meal 1 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 1</span>
                    <span className="text-xs text-gray-400">قبل التمرين بـ 90 دقيقة</span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚡ وجبة قبل التمرين</span>
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 80-100 غرام شوفان مطبوخ بالماء أو حليب قليل الدسم.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> موزة متوسطة الحجم + ملعقة كبيرة عسل طبيعي.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 4 بياض بيض + 1 بيضة كاملة (أو سكوب واي بروتين).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> كوب قهوة سوداء لزيادة التركيز.</li>
                  </ul>
                </div>

                {/* Meal 2 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 2</span>
                    <span className="text-xs text-gray-400">مباشرة بعد التمرين</span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>💪 وجبة بعد التمرين</span>
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 سكوب واي بروتين معزول (Iso Whey).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 3-5 حبات تمر أو موزة سريعة الامتصاص.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 5 غرام كرياتين مونوهيدرات لملء مخازن العضلات.</li>
                  </ul>
                </div>

                {/* Meal 3 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 3</span>
                    <span className="text-xs text-gray-400">بعد التمرين بساعة</span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🍗 وجبة الغداء الرئيسية</span>
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 200 غرام صدر دجاج مشوي أو لحم بقري صافي.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 250 غرام أرز بسمتي أو بطاطس مسلوقة.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> طبق سلطة خضراء مع ملعقة زيت زيتون بكر.</li>
                  </ul>
                </div>

                {/* Meal 4 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 4</span>
                    <span className="text-xs text-gray-400">سناك العصر الذهبي</span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🥤 مشروب الشوفان للتضخيم</span>
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 100 غرام شوفان مطحون.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 300 مل حليب كامل أو نصف دسم.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> ملعقتان زبدة فول سوداني + موزة + ملعقة عسل.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> سعرات ضخمة وغنية بالمغذيات (~750 سعرة).</li>
                  </ul>
                </div>

                {/* Meal 5 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 md:col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 5</span>
                    <span className="text-xs text-gray-400">قبل النوم بـ 45 دقيقة</span>
                  </div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🌙 وجبة قبل النوم (استشفاء بطيء)</span>
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 200-250 غرام جبن قريش (غني ببروتين الكازين بطيء الامتصاص لتغذية العضلات طوال 8 ساعات نوم).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> حفنة مكسرات نية (لوز أو جوز) لتوفير دهون صحية وإبطاء الهضم.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> شرائح خيار أو طماطم مع رشة زعتر وزيت زيتون.</li>
                  </ul>
                </div>

              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <span className="font-bold text-amber-300 text-sm sm:text-base">
                  🔥 هدف نظام التنشيف: حرق الدهون الحشوية وتحت الجلد مع حماية كل غرام عضل وزيادة الشدة.
                </span>
                <span className="text-xs bg-amber-400 text-black font-extrabold px-3 py-1 rounded-lg">
                  عجز -500 سعرة
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Cut Meal 1 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 1</span>
                    <span className="text-xs text-gray-400">قبل التمرين</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">وجبة قبل التمرين</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 50 غرام شوفان مع ماء وقرفة.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 5 بياض بيض + 1 بيضة كاملة.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> نصف تفاحة خضراء أو حفنة توت.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> إسبريسو أو شاي أخضر.</li>
                  </ul>
                </div>

                {/* Cut Meal 2 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 2</span>
                    <span className="text-xs text-gray-400">بعد التمرين</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">بعد التمرين مباشرة</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 سكوب آيزو بروتين (خالي من الدهون والسكر تمامًا).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 2 حبة تمر أو كيك أرز (Rice Cake).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 5 غرام كرياتين مونوهيدرات.</li>
                  </ul>
                </div>

                {/* Cut Meal 3 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 3</span>
                    <span className="text-xs text-gray-400">وجبة الغداء</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">الغداء المحسوب</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 200 غرام صدر دجاج متبل مشوي أو سمك فيليه.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 120-150 غرام بطاطا حلوة مشوية أو أرز بني.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> صحن خضار سوتيه كبير (بروكلي، كوسا، سبانخ) للشبع.</li>
                  </ul>
                </div>

                {/* Cut Meal 4 */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">وجبة 4</span>
                    <span className="text-xs text-gray-400">قبل النوم</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">قبل النوم</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 200 غرام جبن قريش قليل الملح أو زبادي يوناني 0%.</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 10 حبات لوز نيء (دهون صحية محسوبة).</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> شرائح خيار وخس للشعور بالامتلاء طوال الليل.</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* --- MACROS BREAKDOWN SECTION --- */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              توزيع العناصر الغذائية
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              نسب الماكروز <span className="text-amber-400">(Macros Breakdown)</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              توزيع نسب البروتين والكاربوهيدرات والدهون الصحية علميًا وفق كل مرحلة تدريبية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Bulking Bar */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-white">التضخيم (Bulking)</h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">طاقة وبناء</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الكاربوهيدرات (Carbs)</span>
                    <span className="text-amber-400">60%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>البروتين (Protein)</span>
                    <span className="text-amber-300">30%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-200 h-full rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الدهون الصحية (Healthy Fats)</span>
                    <span className="text-yellow-600">10%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-600 h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 pt-3 border-t border-white/5">
                توزيع مصمم لتوفير طاقة قصوى في التدريبات الثقيلة وتسريع إعادة بناء مخازن الجليكوجين العضلي.
              </p>
            </div>

            {/* Cutting Bar */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-amber-500/30 hover:border-amber-400 backdrop-blur-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-xl"></div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-white">التنشيف (Cutting)</h3>
                <span className="text-xs bg-amber-400 text-black px-3 py-1 rounded-full font-black">الموصى به</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>البروتين (Protein)</span>
                    <span className="text-amber-400 font-black">60%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الكاربوهيدرات (Carbs)</span>
                    <span className="text-amber-300">30%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-300 to-yellow-200 h-full rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الدهون الصحية (Healthy Fats)</span>
                    <span className="text-yellow-600">10%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-600 h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 pt-3 border-t border-white/5">
                نسبة بروتين مرتفعة لحماية العضلات من الهدم أثناء عجز السعرات مع إبقاء الكارب كافيًا لأداء تدريبي قوي.
              </p>
            </div>

            {/* Extreme Cut Bar */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-extrabold text-white">تنشيف قاسي (Extreme)</h3>
                <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full font-bold">للبطولات</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>البروتين (Protein)</span>
                    <span className="text-amber-400">70%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الكاربوهيدرات (Carbs)</span>
                    <span className="text-amber-300">20%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-300 to-yellow-200 h-full rounded-full transition-all duration-1000" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                    <span>الدهون الصحية (Healthy Fats)</span>
                    <span className="text-yellow-600">10%</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-600 h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 pt-3 border-t border-white/5">
                بروتوكول احترافي لفترات قصيرة قبل البطولات أو جلسات التصوير للوصول إلى أدنى نسبة دهون وأعلى تفاصيل عضلية.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --- FOOD GUIDE SECTION --- */}
      <section id="foodguide" className="py-24 relative z-10 bg-[#0b0b10]/90 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              دليلك الذكي للتسوق والطبخ
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              دليل الأطعمة <span className="text-amber-400">الشامل</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              أفضل المصادر الغذائية الطبيعية، فوائدها الحيوية، وكيفية توظيفها في وجباتك اليومية لبناء جسم مثالي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Protein Card */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-6 group shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                🥩
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  البروتينات (Proteins)
                </h3>
                <span className="text-xs text-amber-300 font-semibold">بناء واستشفاء الألياف العضلية</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">⭐ أفضل المصادر:</h4>
                <div className="flex flex-wrap gap-2">
                  {['صدور الدجاج', 'اللحم البقري الصافي', 'سمك السلمون والفيليه', 'بياض وبيض كامل', 'الجبن القريش', 'الواي بروتين', 'التونة بالماء'].map((item, i) => (
                    <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold text-amber-400">💡 أهم الفوائد:</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  توفير الأحماض الأمينية الأساسية (EAA & BCAA)، رفع معدل الحرق بفضل التأثير الحراري العالي للبروتين (TEF)، وزيادة الشبع لفترات طويلة.
                </p>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-6 group shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                🍚
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  الكاربوهيدرات (Carbohydrates)
                </h3>
                <span className="text-xs text-amber-300 font-semibold">مصدر الطاقة الأساسي للجهاز العصبي والجيم</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">⭐ أفضل المصادر:</h4>
                <div className="flex flex-wrap gap-2">
                  {['الشوفان الكامل', 'الأرز البسمتي والأبيض', 'البطاطا الحلوة والبطاطس', 'الكينوا', 'الموز والتمر', 'خبز الحبوب الكاملة', 'كيك الأرز'].map((item, i) => (
                    <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold text-amber-400">💡 أهم الفوائد:</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  ملء مخازن الجليكوجين العضلي والكبد، إعطاء العضلة مظهرًا ممتلئًا (Full Look)، وتحسين الأداء في التمارين عالية الكثافة.
                </p>
              </div>
            </div>

            {/* Fats Card */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-6 group shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                🥑
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  الدهون الصحية (Healthy Fats)
                </h3>
                <span className="text-xs text-amber-300 font-semibold">توازن الهرمونات وصحة المفاصل والدماغ</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">⭐ أفضل المصادر:</h4>
                <div className="flex flex-wrap gap-2">
                  {['الأفوكادو', 'زيت الزيتون البكر الممتاز', 'المكسرات النية (لوز، عين جمل)', 'زبدة الفول السوداني الطبيعية', 'بذور الشيا والكتان', 'صفار البيض البلدي'].map((item, i) => (
                    <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold text-amber-400">💡 أهم الفوائد:</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  تحفيز إنتاج التستوستيرون، تسهيل امتصاص فيتامينات A, D, E, K، وتزييت المفاصل لحمايتها من الخشونة مع الأوزان الثقيلة.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- OAT RECIPES SECTION --- */}
      <section id="recipes" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              المطبخ الرياضي الذكي
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              وصفات الشوفان <span className="text-amber-400">الذهبية</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              ثلاث وصفات سرية ولذيذة جداً من ابتكار كابتن عبدالرحيم لتحقيق أهدافك بأسهل وألذ طريقة ممكنة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Recipe 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-2 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🥤</span>
                <span className="text-xs bg-amber-500 text-black font-extrabold px-3 py-1 rounded-full">
                  ~ 780 سعرة
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-white">مشروب الشوفان للتضخيم</h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">Monster Bulking Shake</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase">المكونات الذهبية:</h4>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 100 غرام شوفان مطحون ناعم.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 350 مل حليب كامل الدسم.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 سكوب واي بروتين (شوكولاتة أو فانيليا).</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> ملعقتان كبيرتان زبدة فول سوداني طبيعية.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> موزة كبيرة + ملعقة عسل نحل طبيعي.</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-300">
                <strong>طريقة التحضير:</strong> اخلط جميع المكونات في الخلاط لمدة 60 ثانية حتى يصبح القوام كريميًا وسلسًا للشرب.
              </div>
            </div>

            {/* Recipe 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-2 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🥛</span>
                <span className="text-xs bg-yellow-400 text-black font-extrabold px-3 py-1 rounded-full">
                  ~ 320 سعرة
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-white">مشروب الشوفان للتنشيف</h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">Lean Shred Shake</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase">المكونات الذهبية:</h4>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 40 غرام شوفان مطحون.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 300 مل حليب لوز غير محلى أو ماء مثلج.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 سكوب واي بروتين معزول (Iso Whey).</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> نصف ملعقة قرفة مطحونة (تساعد على تنظيم سكر الدم).</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> مكعبات ثلج مع القليل من محلي ستيفيا.</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-300">
                <strong>طريقة التحضير:</strong> اضرب المكونات في الخلاط واستمتع بمشروب غني بالبروتين قليل الكارب والسعرات.
              </div>
            </div>

            {/* Recipe 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-2 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🥞</span>
                <span className="text-xs bg-amber-400 text-black font-extrabold px-3 py-1 rounded-full">
                  ~ 450 سعرة
                </span>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-white">بانكيك الشوفان البروتيني</h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">High Protein Oat Pancake</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase">المكونات الذهبية:</h4>
                <ul className="text-xs text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 60 غرام دقيق الشوفان.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 1 بيضة كاملة + 3 بياض بيض.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> نصف سكوب واي بروتين فانيليا.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> نصف ملعقة صغيرة بيكنج باودر + فانيليا سائلة.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> للتزيين: رشة قرفة وشرائح فراولة طازجة.</li>
                </ul>
              </div>

              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-300">
                <strong>طريقة التحضير:</strong> اخلط المكونات واطبخها على مقلاة غير لاصقة ممسوحة بزيت جوز الهند لمدة دقيقتين لكل وجه.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- PRE-WORKOUT COMPARISON DEEP DIVE ARTICLE --- */}
      <section id="preworkout" className="py-24 relative z-10 bg-[#0b0b10]/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              مقال رياضي حصري
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              مقارنة طاقة التمرين <span className="text-amber-400">(Pre-Workout Showdown)</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              هل الأفضل الاعتماد على الحل الطبيعي (الموز + زبدة الفول السوداني) أم مكملات الطاقة الصناعية (Pre-Workout)؟
            </p>
          </div>

          {/* Versus Visual Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Natural Option */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl">🍌 🥜</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                  خيار طبيعي مستدام 100%
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">الموز + زبدة الفول السوداني</h3>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-emerald-400">✅ المميزات (Advantages):</h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• سكر طبيعي (فركتوز وسكروز) سريع ومتوسط الامتصاص يعطي طاقة مستقرة.</li>
                  <li>• غني بالبوتاسيوم والمغنيسيوم لمنع الشد العضلي وتحسين انقباض العضلات.</li>
                  <li>• دهون صحية غير مشبعة تبطئ استهلاك السكر وتمنع هبوط الطاقة المفاجئ (No Crash).</li>
                  <li>• آمن تمامًا لمرضى الضغط والقلب وخالي من أي محفزات عصبية كيميائية.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-sm font-bold text-rose-400">❌ السلبيات (Disadvantages):</h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• يحتاج من 45 إلى 60 دقيقة للهضم المريح قبل بدء التمرين الشاق.</li>
                  <li>• سعرات حرارية أعلى قد تتطلب خصمها بدقة أثناء التنشيف الصارم.</li>
                </ul>
              </div>
            </div>

            {/* Supplement Option */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl">⚡ 🧪</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                  مكمل الطاقة المركز (Pre-Workout)
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">مكمل الطاقة والضخ الصناعي</h3>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-amber-400">✅ المميزات (Advantages):</h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• تركيز ذهني فائق ويقظة قصوى بسبب جرعات الكافيين العالية (200-350mg).</li>
                  <li>• ضخ دم قوي (Muscle Pump) بفضل مادة السيترولين والنيتريك أوكسايد.</li>
                  <li>• تأخير الشعور بالتعب العضلي وحمض اللاكتيك بواسطة مادة البيتا ألانين (Beta-Alanine).</li>
                  <li>• صفر سعرات حرارية تقريبًا، وهو ما يناسب فترات التنشيف القاسي.</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-sm font-bold text-rose-400">❌ السلبيات (Disadvantages):</h4>
                <ul className="text-xs text-gray-300 space-y-1.5">
                  <li>• قد يسبب الأرق الشديد إذا تم تناوله في التدريبات المسائية.</li>
                  <li>• تعود الجهاز العصبي عليه وتراجع حساسية مستقبلات الأدينوزين مع الوقت.</li>
                  <li>• هبوط مفاجئ في الطاقة والمزاج (Crash) بعد انتهاء مفعول الكافيين.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-8">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>جدول المقارنة المباشرة والشاملة</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm text-gray-300">
                <thead className="bg-white/5 text-amber-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-4">عنصر المقارنة</th>
                    <th className="p-4">الموز + زبدة الفول السوداني 🍌</th>
                    <th className="p-4">مكمل الـ Pre Workout ⚡</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">سرعة الامتصاص وبدء المفعول</td>
                    <td className="p-4 text-gray-300">خلال 45 - 60 دقيقة</td>
                    <td className="p-4 text-amber-300">سريع جداً (15 - 30 دقيقة)</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">استقرار الطاقة (Energy Curve)</td>
                    <td className="p-4 text-emerald-400">طاقة متدرجة ومستقرة بدون هبوط</td>
                    <td className="p-4 text-yellow-400">انفجار طاقة يعقبه هبوط أحياناً</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">التأثير على النوم والقلب</td>
                    <td className="p-4 text-emerald-400">آمن 100% في أي وقت</td>
                    <td className="p-4 text-rose-400">قد يعطل النوم إذا شرب بعد 5 مساءً</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">السعرات الحرارية</td>
                    <td className="p-4 text-gray-300">180 - 250 سعرة حرارية</td>
                    <td className="p-4 text-emerald-400">0 - 15 سعرة حرارية</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-4 font-bold text-white">الاعتياد والتعود الإدماني</td>
                    <td className="p-4 text-emerald-400">لا يوجد أي تعود</td>
                    <td className="p-4 text-rose-400">يحتاج لفترات انقطاع دورية (Cycle)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Coach Verdict */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/40 text-center sm:text-right flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
              👑
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2">توصية وخلاصة كابتن عبدالرحيم:</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                "اجعل <strong>الموز وزبدة الفول السوداني</strong> هو أساسك اليومي المستدام لبناء صحتك وطاقتك الطبيعية، واستخدم <strong>مكمل الطاقة</strong> فقط في أيام التمارين الشاقة جدًا (مثل يوم الأرجل الثقيل) أو عند الشعور بالإرهاق الاستثنائي بعد يوم عمل طويل، مع تجنب استخدامه في المساء لحماية جودة نومك."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- 30 FITNESS RULES SECTION (INTERACTIVE ACCORDION) --- */}
      <section id="rules" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              دستور الرياضي المحترف
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              القواعد الذهبية الـ <span className="text-amber-400">30</span> للياقة
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              ثلاثون قاعدة ذهبية تختصر سنوات من العلم والخبرة العملية في التدريب، التغذية، الاستشفاء، وعقلية الأبطال. اضغط على أي قاعدة لقراءة التفاصيل الكاملة.
            </p>
          </div>

          {/* Rules Accordion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fitnessRules.map((rule) => {
              const isOpen = expandedRule === rule.id;
              return (
                <div 
                  key={rule.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-white/[0.06] border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedRule(isOpen ? null : rule.id)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        isOpen ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400 border border-white/10'
                      }`}>
                        {rule.id}
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-amber-400 font-semibold block mb-0.5">{rule.category}</span>
                        <h4 className="text-sm sm:text-base font-bold text-white">{rule.title}</h4>
                      </div>
                    </div>
                    <div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 border-t border-white/5 leading-relaxed bg-black/20 animate-fadeIn">
                      <p>{rule.text}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- INTERACTIVE CALCULATORS & WORKOUT TIMER SECTION --- */}
      <section id="calculators" className="py-24 relative z-10 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              أدوات تفاعلية ذكية
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              حاسبات اللياقة <span className="text-amber-400">ومؤقت التمرين</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              احسب احتياجك الدقيق من السعرات والماكروز، مؤشر كتلة جسمك (BMI)، واستخدم مؤقت الراحة بين المجموعات.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. BMI Calculator */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">حاسبة كتلة الجسم</h3>
                  <span className="text-xs text-gray-400">BMI Calculator</span>
                </div>
              </div>

              <form onSubmit={handleCalculateBMI} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">الوزن الحالي (كجم): {bmiWeight}</label>
                  <input 
                    type="range" 
                    min="40" 
                    max="160" 
                    value={bmiWeight} 
                    onChange={(e) => setBmiWeight(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">الطول (سم): {bmiHeight}</label>
                  <input 
                    type="range" 
                    min="130" 
                    max="220" 
                    value={bmiHeight} 
                    onChange={(e) => setBmiHeight(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  احسب مؤشر كتلة الجسم
                </button>
              </form>

              {bmiResult && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">مؤشر BMI:</span>
                    <span className="text-2xl font-black text-amber-400">{bmiResult.bmi}</span>
                  </div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span className="text-gray-300">التصنيف:</span>
                    <span className={bmiResult.color}>{bmiResult.category}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed pt-2 border-t border-white/5">
                    {bmiResult.advice}
                  </p>
                </div>
              )}
            </div>

            {/* 2. Calorie & Macros Calculator */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl shadow-2xl space-y-6 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">حاسبة السعرات والماكروز</h3>
                  <span className="text-xs text-gray-400">BMR & TDEE Calculator</span>
                </div>
              </div>

              <form onSubmit={handleCalculateCalories} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalGender('male')}
                    className={`py-2 rounded-xl text-xs font-bold border ${calGender === 'male' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
                  >
                    ذكر 👨
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalGender('female')}
                    className={`py-2 rounded-xl text-xs font-bold border ${calGender === 'female' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
                  >
                    أنثى 👩
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">السن</label>
                    <input 
                      type="number" 
                      value={calAge} 
                      onChange={(e) => setCalAge(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-center text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">الوزن (كجم)</label>
                    <input 
                      type="number" 
                      value={calWeight} 
                      onChange={(e) => setCalWeight(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-center text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">الطول (سم)</label>
                    <input 
                      type="number" 
                      value={calHeight} 
                      onChange={(e) => setCalHeight(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-center text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">مستوى النشاط الأسبوعي</label>
                  <select
                    value={calActivity}
                    onChange={(e) => setCalActivity(Number(e.target.value))}
                    className="w-full bg-[#15151c] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value={1.2}>نشاط خامل (بدون تمرين تقريباً)</option>
                    <option value={1.375}>نشاط خفيف (تمرين 1-3 أيام)</option>
                    <option value={1.55}>نشاط معتدل (تمرين 3-5 أيام)</option>
                    <option value={1.725}>نشاط عالي (تمرين 6-7 أيام)</option>
                    <option value={1.9}>نشاط رياضي شاق (تمرين مرتين يوميًا)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">الهدف المنشود</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCalGoal('bulk')}
                      className={`py-1.5 rounded-lg text-[11px] font-bold border ${calGoal === 'bulk' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
                    >
                      تضخيم
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalGoal('maintain')}
                      className={`py-1.5 rounded-lg text-[11px] font-bold border ${calGoal === 'maintain' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
                    >
                      ثبات
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalGoal('cut')}
                      className={`py-1.5 rounded-lg text-[11px] font-bold border ${calGoal === 'cut' ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 text-gray-300 border-white/10'}`}
                    >
                      تنشيف
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-sm shadow-md hover:opacity-90 transition-opacity"
                >
                  احسب احتياج السعرات والماكروز
                </button>
              </form>

              {calResult && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">السعرات المستهدفة:</span>
                    <span className="text-2xl font-black text-amber-400">{calResult.targetCalories} <span className="text-xs text-white font-normal">سعرة/يوم</span></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 block">بروتين</span>
                      <span className="text-sm font-bold text-amber-300">{calResult.proteinGrams}g</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 block">كارب</span>
                      <span className="text-sm font-bold text-amber-300">{calResult.carbsGrams}g</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 block">دهون</span>
                      <span className="text-sm font-bold text-amber-300">{calResult.fatGrams}g</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Interactive Workout Rest Timer */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">مؤقت الراحة بين المجموعات</h3>
                    <span className="text-xs text-gray-400">Rest Interval Timer</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  حافظ على شدة تمرينك وتجنب إطالة الراحة لضمان أقصى ضخ دم وتحفيز عضلي.
                </p>
              </div>

              {/* Timer Dial Display */}
              <div className="text-center py-6">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full border-4 border-white/10 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <span className="text-5xl font-black font-mono text-amber-400 tracking-wider">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                      {timerRunning ? 'العداد يعمل ⏳' : 'في الانتظار ⏸️'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => resetTimer(sec)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      timerInitial === sec && !timerRunning 
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400' 
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {sec} ث
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    timerRunning
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:opacity-90'
                  }`}
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{timerRunning ? 'إيقاف مؤقت' : 'بدء الراحة'}</span>
                </button>

                <button
                  onClick={() => resetTimer(timerInitial)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-colors"
                  title="إعادة ضبط"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- SERVICES & PACKAGES SECTION --- */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              باقات التدريب والمتابعة
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              خدمات كابتن <span className="text-amber-400">عبدالرحيم</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              اختر الباقة التي تناسب طموحك وابدأ رحلة التحول الجسدي الشاملة مع متابعة أسبوعية دقيقة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Package 1: Basic */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 backdrop-blur-xl transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full font-bold">باقة البداية</span>
                <h3 className="text-2xl font-black text-white">البرنامج التدريبي والغذائي</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  مناسب لمن يمتلك الانضباط الذاتي ويحتاج إلى خطة علمية واضحة ومخصصة لهدفه بدون متابعة يومية.
                </p>

                <ul className="text-xs text-gray-300 space-y-3 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> جدول تمارين مخصص حسب عدد أيامك بالجيم.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> نظام غذائي محسوب السعرات والماكروز بدقة.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> ملف PDF شامل لكل التمارين والبدائل.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> كورس المكملات الغذائية المناسبة لميزانيتك.</li>
                </ul>
              </div>

              <a 
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A7%D9%84%D8%AA%D8%AF%D8%B1%D9%8A%D8%A8%D9%8A"
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-white/10 text-white font-bold text-center text-sm transition-all"
              >
                احجز هذه الخطة
              </a>
            </div>

            {/* Package 2: Gold (VIP) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent border-2 border-amber-400 backdrop-blur-xl transition-all flex flex-col justify-between space-y-6 relative shadow-[0_0_40px_rgba(245,158,11,0.25)] -translate-y-2">
              <div className="absolute -top-3 right-8 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                الأكثر طلباً واشتراكاً 👑
              </div>

              <div className="space-y-4 pt-2">
                <span className="text-xs bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full font-bold">الباقة الذهبية VIP</span>
                <h3 className="text-3xl font-black text-white">المتابعة الأونلاين الشخصية</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  تحول جذري وإشراف مباشر من الكابتن عبدالرحيم خطوة بخطوة حتى تصل لأفضل شكل في حياتك.
                </p>

                <ul className="text-xs text-gray-200 space-y-3 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> <strong>متابعة أسبوعية دقيقة</strong> للوزن والقياسات والصور.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> <strong>تعديل مستمر للنظام الغذائي والتمارين</strong> وفق التطور.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> <strong>تواصل مباشر عبر الواتساب</strong> للرد على أي استفسار.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> <strong>تصحيح تكنيك التمارين بالفيديو</strong> لتفادي أي أخطاء.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> خطة مكملات وفيتامينات كاملة وتوجيهات النوم.</li>
                </ul>
              </div>

              <a 
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%B0%D9%87%D8%A8%D9%8A%D8%A9%20VIP"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-center text-base shadow-lg hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all"
              >
                اشترك في باقة VIP الآن
              </a>
            </div>

            {/* Package 3: Championship / 6 Months */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 backdrop-blur-xl transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full font-bold">باقة البطولات والتحول الكامل</span>
                <h3 className="text-2xl font-black text-white">اشتراك 6 أشهر VIP</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  للأبطال الذين يسعون لتغيير هيئة أجسامهم تمامًا أو التجهيز للبطولات وجلسات التصوير بأعلى معايير الالتزام.
                </p>

                <ul className="text-xs text-gray-300 space-y-3 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> جميع مميزات الباقة الذهبية لمدة 6 أشهر كاملة.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> بروتوكولات تفريغ وتحميل الكاربوهيدرات المتقدمة.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> خصم خاص + أسبوعين تجميد اشتراك في حالات السفر.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> مكالمة صوتية أو فيديو استشارية شهرية.</li>
                </ul>
              </div>

              <a 
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D9%80%206%20%D8%A3%D8%B4%D9%87%D8%B1"
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-white/10 text-white font-bold text-center text-sm transition-all"
              >
                احجز باقة الـ 6 أشهر
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* --- TESTIMONIALS & SUCCESS STORIES --- */}
      <section className="py-20 relative z-10 bg-[#0b0b10]/90 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              آراء المتدربين
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              قصص نجاح <span className="text-amber-400">أبطال BodA</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              تجارب حقيقية لمتدربين حققوا أهدافهم في خسارة الدهون وبناء العضلات تحت إشراف الكابتن عبدالرحيم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "نزلت مع كابتن عبدالرحيم 14 كيلو دهون في 3 شهور بدون حرمان ولا جوع! النظام كان مريح جداً ومناسب لدوامي في الشركة، وتكنيك التمارين فرق معايا جدًا في القوة."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  أ.م
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">أحمد محمود</h4>
                  <span className="text-xs text-amber-400">خسارة 14 كجم دهون</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "كنت بعاني من النحافة سنين، ومع خطة التضخيم النظيف زدت 8 كجم عضلات صافية بدون زيادة في دهون البطن. كابتن عبدالرحيم دقيق جداً وبيرد على كل تفصيلة."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  م.س
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">محمد سامي</h4>
                  <span className="text-xs text-amber-400">زيادة 8 كجم كتلة عضلية</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 backdrop-blur-xl transition-all space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "أفضل تجربة تدريب أونلاين اشتركت فيها، المتابعة الأسبوعية بتخليك دايماً ملتزم ومتحمس. جدول الـ 6 أيام مرتب بزوايا ضخ ممتازة بدون إجهاد للمفاصل."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  ع.خ
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">عمر خالد</h4>
                  <span className="text-xs text-amber-400">تحول بدني شامل (6 أشهر)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              إجابات مباشرة
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              الأسئلة <span className="text-amber-400">الشائعة</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'هل التدريب الأونلاين فعال مثل المدرب الشخصي في الجيم؟',
                a: 'نعم وبكفاءة أعلى في كثير من الأحيان! لأنك تحصل على خطة تغذية وتدريب مخصصة لك 100% مع متابعة أسبوعية وتصحيح لتكنيك أدائك بالفيديو، مما يمنحك التزاماً مستمراً طوال اليوم وليس فقط خلال ساعة التمرين.'
              },
              {
                q: 'متى سأبدأ في رؤية نتائج ملموسة في جسمي؟',
                a: 'مع الالتزام الكامل بالنظام الغذائي والجدول التدريبي، ستلاحظ زيادة ملحوظة في مستويات الطاقة والقوة خلال أول أسبوعين، وتغيرات واضحة في مقاسات الجسم والصور بعد 4 إلى 6 أسابيع.'
              },
              {
                q: 'هل المكملات الغذائية إجبارية لتحقيق النتائج؟',
                a: 'إطلاقاً! الأساس هو الأكل الطبيعي المحسوب. المكملات الغذائية نستخدمها فقط لسد النقص وللراحة، ويمكنك تحقيق نتائج مذهلة بالاعتماد على الطعام الحقيقي فقط.'
              },
              {
                q: 'كيف تتم المتابعة الأسبوعية مع الكابتن؟',
                a: 'نحدد يومًا ثابتًا أسبوعيًا لإرسال الوزن على الريق، مقاسات الجسم، وصور التطور، مع تقييم أدائك وتعديل الخطة تلقائيًا حسب سرعة استجابة جسمك.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4"
                  >
                    <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* --- CONTACT & SOCIAL SECTION --- */}
      <section id="contact" className="py-24 relative z-10 bg-[#08080c] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-bold text-sm tracking-wider uppercase bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full">
              ابدأ رحلتك اليوم
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              تواصل مع الكابتن <span className="text-amber-400">عبدالرحيم</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              لا تؤجل خطوتك القادمة. انقر على الوسيلة المفضلة لديك لبدء التقييم المبدئي وتصميم برنامجك التدريبي.
            </p>
          </div>

          {/* Social Channels Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            
            {/* WhatsApp */}
            <a 
              href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A7%D9%84%D8%AA%D8%AF%D8%B1%D9%8A%D8%A8" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">واتساب</span>
              <span className="text-[10px] text-gray-400">رد فوري</span>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-pink-400/60 hover:bg-pink-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">إنستغرام</span>
              <span className="text-[10px] text-gray-400">يوميات وتمارين</span>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">تيك توك</span>
              <span className="text-[10px] text-gray-400">فيديوهات قصيرة</span>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">فيسبوك</span>
              <span className="text-[10px] text-gray-400">مقالات وتحديثات</span>
            </a>

            {/* Phone */}
            <a 
              href="tel:+201000000000" 
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/60 hover:bg-amber-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">اتصال هاتف</span>
              <span className="text-[10px] text-gray-400">مكالمات مباشرة</span>
            </a>

            {/* Google Maps / Location */}
            <a 
              href="#contact" 
              className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-yellow-400/60 hover:bg-yellow-500/10 transition-all flex flex-col items-center justify-center text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-sm">الموقع</span>
              <span className="text-[10px] text-gray-400">مصر والتدريب أونلاين</span>
            </a>

          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-3">
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                جاهز لبناء جسمك والانضمام لفريق <span className="text-amber-400">BodA</span>؟
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                تواصل الآن عبر الواتساب واشرح هدفك (تضخيم، تنشيف، أو إعادة تأهيل) لنبدأ فورًا في إعداد ملفك التدريبي والغذائي.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A8%D8%AF%D8%A1%20%D8%A7%D9%84%D8%AA%D8%AF%D8%B1%D9%8A%D8%A8%20%D9%85%D8%B9%D9%83%20%D8%A7%D9%84%D8%A2%D9%86"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="w-6 h-6 fill-black" />
                <span>ابدأ محادثة الواتساب الآن</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 bg-[#050507] border-t border-white/10 relative z-10 text-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1.5px]">
                  <div className="w-full h-full bg-[#090909] rounded-xl flex items-center justify-center font-black text-amber-400 text-lg">
                    B
                  </div>
                </div>
                <span className="text-3xl font-black text-white">
                  Bod<span className="text-amber-400">A</span>
                </span>
              </div>

              <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                <strong>Build Your Self</strong> — العلامة الرياضية الفاخرة للتدريب والتغذية بإشراف الكابتن عبدالرحيم. تمكين الأبطال من تحقيق إمكاناتهم الجسدية القصوى بالعلم والشغف.
              </p>

              <div className="text-xs text-amber-400/90 font-semibold">
                🏆 إشراف وتصميم: Coach Abdelrahim
              </div>
            </div>

            {/* Quick Links 1 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">الأقسام الرئيسية</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li><a href="#hero" className="hover:text-amber-400 transition-colors">الرئيسية</a></li>
                <li><a href="#about" className="hover:text-amber-400 transition-colors">من هو الكابتن</a></li>
                <li><a href="#workout" className="hover:text-amber-400 transition-colors">جدول التمارين (6 أيام)</a></li>
                <li><a href="#nutrition" className="hover:text-amber-400 transition-colors">أنظمة التضخيم والتنشيف</a></li>
                <li><a href="#foodguide" className="hover:text-amber-400 transition-colors">دليل الأطعمة الشامل</a></li>
              </ul>
            </div>

            {/* Quick Links 2 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">أدوات ومقالات</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li><a href="#recipes" className="hover:text-amber-400 transition-colors">وصفات الشوفان الصحية</a></li>
                <li><a href="#preworkout" className="hover:text-amber-400 transition-colors">مقارنة الـ Pre Workout</a></li>
                <li><a href="#rules" className="hover:text-amber-400 transition-colors">قواعد اللياقة الـ 30</a></li>
                <li><a href="#calculators" className="hover:text-amber-400 transition-colors">حاسبة السعرات و BMI</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">تواصل واشترك</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} — منصة <strong className="text-amber-400">BodA</strong> | Coach Abdelrahim
            </div>
            <div className="flex items-center gap-4">
              <span>Build Your Self</span>
              <span>•</span>
              <span>Dark Luxury Fitness</span>
            </div>
          </div>

        </div>
      </footer>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <a
        href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D9%83%D8%A7%D8%A8%D8%AA%D9%86%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%8A%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20BodA"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-110 hover:bg-emerald-400 transition-all duration-300 flex items-center justify-center group"
        title="تواصل عبر الواتساب"
        aria-label="WhatsApp Chat"
      >
        <MessageSquare className="w-7 h-7 fill-white" />
        <span className="absolute right-full mr-3 bg-[#0c0c10] border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          تواصل مع كابتن عبدالرحيم 💬
        </span>
      </a>

    </div>
  );
}