STAGES.push(
  { id: 501, subject: "music", name: "音与记谱", en: "Pitch & Notation", code: "01", goal: "认识音高、五线谱与常用记号。", weeks: "第 1-6 周", color: "#b3558e", topics: ["音高", "五线谱", "谱号", "变音记号"] },
  { id: 502, subject: "music", name: "节奏与节拍", en: "Rhythm & Meter", code: "02", goal: "掌握拍子、节奏型与强弱规律。", weeks: "第 7-12 周", color: "#2e6f8f", topics: ["节奏", "节拍", "拍号", "切分音"] },
  { id: 503, subject: "music", name: "音程与和弦", en: "Intervals & Chords", code: "03", goal: "理解音程距离与三和弦、七和弦结构。", weeks: "第 13-18 周", color: "#0e7c6b", topics: ["音程", "半音全音", "三和弦", "七和弦"] },
  { id: 504, subject: "music", name: "调式与音乐表达", en: "Keys & Expression", code: "04", goal: "走进大调小调、和声、旋律与终止式。", weeks: "第 19-24 周", color: "#a97d12", topics: ["大调", "小调", "调性", "终止式"] }
);

TERMS.push(
  { id: "note", subject: "music", term: "音符", en: "Note", stage: 501, cat: "记谱", diff: 1, def: "表示音高与时值的音乐符号。", example: "四分音符在 4/4 拍中占一拍。", tip: "音符既告诉你唱多高，也告诉你唱多久。", related: ["pitch", "staff", "rest"] },
  { id: "pitch", subject: "music", term: "音高", en: "Pitch", stage: 501, cat: "音", diff: 1, def: "声音振动频率给人的高低感觉。", example: "do 与 mi 相比，mi 的音高更高。", tip: "音高由频率决定，频率越高音越高。", related: ["note", "octave", "interval"] },
  { id: "octave", subject: "music", term: "八度", en: "Octave", stage: 501, cat: "音", diff: 1, def: "频率翻倍形成的两个同名音之间的距离。", example: "男低音与女高音常相隔一个或几个八度唱同一个音名。", tip: "八度内的音听起来“像同一个音”。", related: ["pitch", "interval", "major_scale"] },
  { id: "staff", subject: "music", term: "五线谱", en: "Staff", stage: 501, cat: "记谱", diff: 1, def: "由五条平行线组成的记谱基础。", example: "高音谱表中的音符位置越高，音高越高。", tip: "线与间共同决定音高位置。", related: ["note", "clef", "bar"] },
  { id: "clef", subject: "music", term: "谱号", en: "Clef", stage: 501, cat: "记谱", diff: 1, def: "规定五线谱上音名位置的记号。", example: "高音谱号与低音谱号分别适合不同音域。", tip: "谱号决定了同一位置代表哪个音。", related: ["staff", "note", "accidental"] },
  { id: "sharp", subject: "music", term: "升号", en: "Sharp", stage: 501, cat: "记号", diff: 1, def: "把音升高半音的记号。", example: "F# 表示比 F 高半音。", tip: "升号写在音符左边或调号中。", related: ["accidental", "flat", "pitch"] },
  { id: "flat", subject: "music", term: "降号", en: "Flat", stage: 501, cat: "记号", diff: 1, def: "把音降低半音的记号。", example: "Bb 表示比 B 低半音。", tip: "降号与升号方向相反。", related: ["accidental", "sharp", "pitch"] },
  { id: "accidental", subject: "music", term: "临时变音记号", en: "Accidental", stage: 501, cat: "记号", diff: 2, def: "临时改变某个音符音高的记号，如升、降、还原。", example: "小节内的 # 只对本小节同音名有效。", tip: "还原号会取消前面的升降。", related: ["sharp", "flat", "note"] },
  { id: "rhythm", subject: "music", term: "节奏", en: "Rhythm", stage: 502, cat: "节奏", diff: 1, def: "音的长短与强弱在时间中的组织。", example: "“哒哒-哒”和“哒-哒哒”是不同的节奏型。", tip: "节奏是音乐的骨架。", related: ["beat", "meter", "syncopation"] },
  { id: "beat", subject: "music", term: "节拍", en: "Beat", stage: 502, cat: "节奏", diff: 1, def: "音乐中均匀重复的基本时间单位。", example: "4/4 拍中每小节有四个均匀的拍。", tip: "打拍子就是感受稳定的 beat。", related: ["rhythm", "meter", "downbeat"] },
  { id: "meter", subject: "music", term: "拍号", en: "Meter / Time Signature", stage: 502, cat: "节奏", diff: 2, def: "标明每小节拍数与单位拍时值的记号。", example: "3/4 表示每小节三拍，以四分音符为一拍。", tip: "上面的数字是拍数，下面是单位拍。", related: ["beat", "bar", "rhythm"] },
  { id: "bar", subject: "music", term: "小节", en: "Bar", stage: 502, cat: "节奏", diff: 1, def: "由小节线划分出的固定拍数单位。", example: "4/4 拍的每个小节内有四拍。", tip: "小节是看谱和数拍的基本单位。", related: ["staff", "meter", "beat"] },
  { id: "tempo", subject: "music", term: "速度", en: "Tempo", stage: 502, cat: "节奏", diff: 1, def: "音乐进行的快慢，常以每分钟拍数表示。", example: "Allegro 表示较快的速度。", tip: "速度标记决定整首作品的快慢基调。", related: ["beat", "rhythm", "dynamics"] },
  { id: "downbeat", subject: "music", term: "强拍", en: "Downbeat", stage: 502, cat: "节奏", diff: 2, def: "小节中通常被强调的第一拍。", example: "进行曲的强拍让脚步整齐有力。", tip: "强拍常是小节结构的重心。", related: ["beat", "meter", "syncopation"] },
  { id: "syncopation", subject: "music", term: "切分音", en: "Syncopation", stage: 502, cat: "节奏", diff: 2, def: "把重音放到弱拍或弱位上的节奏手法。", example: "爵士乐常用切分制造摇摆感。", tip: "切分打破常规强弱，让音乐更有动感。", related: ["rhythm", "downbeat", "beat"] },
  { id: "rest", subject: "music", term: "休止符", en: "Rest", stage: 502, cat: "节奏", diff: 1, def: "表示音乐中停顿时间的符号。", example: "四分休止符表示停顿一拍。", tip: "休止也是节奏的一部分。", related: ["note", "rhythm", "bar"] },
  { id: "interval", subject: "music", term: "音程", en: "Interval", stage: 503, cat: "音程", diff: 1, def: "两个音在音高上的距离。", example: "do 到 mi 构成大三度。", tip: "音程用度数和性质共同描述。", related: ["pitch", "semitone", "triad"] },
  { id: "semitone", subject: "music", term: "半音", en: "Semitone", stage: 503, cat: "音程", diff: 1, def: "钢琴键盘上相邻两键的最小音程。", example: "mi 与 fa 之间就是半音。", tip: "半音是计算音程的基本单位。", related: ["interval", "whole_tone", "accidental"] },
  { id: "whole_tone", subject: "music", term: "全音", en: "Whole Tone", stage: 503, cat: "音程", diff: 1, def: "两个半音相加构成的音程。", example: "do 到 re 之间是全音。", tip: "大调音阶由全音与半音按固定顺序排列。", related: ["interval", "semitone", "major_scale"] },
  { id: "major_scale", subject: "music", term: "大调音阶", en: "Major Scale", stage: 504, cat: "调式", diff: 2, def: "按全全半全全全半排列的七声音阶。", example: "C 大调音阶是 do re mi fa sol la si。", tip: "大调听起来明亮稳定。", related: ["whole_tone", "minor_scale", "key"] },
  { id: "minor_scale", subject: "music", term: "小调音阶", en: "Minor Scale", stage: 504, cat: "调式", diff: 2, def: "以小三度关系为中心、色彩较暗的调式。", example: "A 小调与 C 大调使用相同的调号。", tip: "小调常给人柔和或忧伤的感觉。", related: ["major_scale", "key", "triad"] },
  { id: "key", subject: "music", term: "调", en: "Key", stage: 504, cat: "调式", diff: 2, def: "以某个音为主音的音高体系。", example: "G 大调表示以 G 为主音的大调。", tip: "调决定了作品的“家”在哪里。", related: ["major_scale", "minor_scale", "cadence"] },
  { id: "triad", subject: "music", term: "三和弦", en: "Triad", stage: 503, cat: "和弦", diff: 2, def: "按三度关系叠置的三个音组成的和弦。", example: "C、E、G 构成 C 大三和弦。", tip: "三和弦是和声的基础。", related: ["interval", "major_chord", "minor_chord"] },
  { id: "major_chord", subject: "music", term: "大三和弦", en: "Major Chord", stage: 503, cat: "和弦", diff: 2, def: "根音与三音、五音分别构成大三度和小三度的和弦。", example: "C-E-G 是明亮的大三和弦。", tip: "大三和弦听感开阔稳定。", related: ["triad", "minor_chord", "seventh_chord"] },
  { id: "minor_chord", subject: "music", term: "小三和弦", en: "Minor Chord", stage: 503, cat: "和弦", diff: 2, def: "根音与三音构成小三度、与五音构成纯五度的和弦。", example: "A-C-E 是柔和的小三和弦。", tip: "小三和弦比大三和弦更暗。", related: ["triad", "major_chord", "harmony"] },
  { id: "seventh_chord", subject: "music", term: "七和弦", en: "Seventh Chord", stage: 503, cat: "和弦", diff: 3, def: "在三和弦基础上再加入七度音形成的和弦。", example: "G-B-D-F 是属七和弦。", tip: "七和弦增加色彩和解决倾向。", related: ["triad", "major_chord", "cadence"] },
  { id: "harmony", subject: "music", term: "和声", en: "Harmony", stage: 504, cat: "表达", diff: 2, def: "多个音同时发声并形成关系的纵向结构。", example: "伴奏和弦与旋律共同构成和声。", tip: "和声是旋律的“背景颜色”。", related: ["minor_chord", "melody", "cadence"] },
  { id: "melody", subject: "music", term: "旋律", en: "Melody", stage: 504, cat: "表达", diff: 1, def: "由音高和节奏构成的可被记住的横向线条。", example: "哼唱《小星星》就是在唱旋律。", tip: "旋律是音乐最容易被记住的部分。", related: ["note", "rhythm", "harmony"] },
  { id: "dynamics", subject: "music", term: "力度", en: "Dynamics", stage: 504, cat: "表达", diff: 2, def: "音乐演奏的强弱变化。", example: "f 表示强，p 表示弱。", tip: "力度让音乐有起伏和情绪。", related: ["tempo", "melody", "cadence"] },
  { id: "cadence", subject: "music", term: "终止式", en: "Cadence", stage: 504, cat: "表达", diff: 3, def: "乐句或段落结尾处的和声进行，带来停顿或结束感。", example: "属七到主和弦构成完满的终止式。", tip: "终止式告诉听众“一句话说完了”。", related: ["harmony", "key", "seventh_chord"] }
);
