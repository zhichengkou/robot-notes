import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, BookOpen, Bot, Boxes, BrainCircuit, ChevronRight,
  CircleGauge, Github, Layers3, Menu, Network, Search, Sparkles,
  Target, X, Zap
} from 'lucide-react'
import './styles.css'

const categories = [
  { id: '全部', icon: Layers3 },
  { id: '基础理论', icon: BookOpen },
  { id: '运动学', icon: Network },
  { id: '动力学', icon: Boxes },
  { id: '控制', icon: CircleGauge },
  { id: '感知与规划', icon: BrainCircuit },
]

const notes = [
  {
    id: 1,
    category: '基础理论',
    index: '01',
    title: '坐标系与刚体变换',
    brief: '机器人学的共同语言：用旋转矩阵与齐次变换描述位姿。',
    tags: ['SO(3)', 'SE(3)', '齐次矩阵'],
    level: '基础', time: '12 min',
    content: [
      '位姿由位置与姿态共同组成。位置是三维向量，姿态通常用旋转矩阵、欧拉角或四元数表达。',
      '齐次变换矩阵 T∈SE(3) 将旋转 R 与平移 p 统一在一个 4×4 矩阵中，方便坐标系之间的链式变换。',
      '核心关系：¹T₃ = ¹T₂ · ²T₃。矩阵乘法不可交换，书写时应始终检查上下标与变换方向。'
    ],
    formula: 'T = [ R  p ; 0  1 ]'
  },
  {
    id: 2,
    category: '运动学',
    index: '02',
    title: '正运动学与 D-H 参数',
    brief: '从关节变量出发，计算末端执行器在基坐标系中的位姿。',
    tags: ['D-H', '变换链', '机械臂'],
    level: '基础', time: '18 min',
    content: [
      '正运动学回答“已知各关节角，末端在哪里”。串联机械臂的结果是各关节变换矩阵依次相乘。',
      '标准 D-H 法用 θ、d、a、α 四个参数描述相邻连杆关系。建系的一致性比参数表本身更重要。',
      '验证模型时，可先代入零位构型，检查所得位姿是否与机械结构的直观状态一致。'
    ],
    formula: '⁰Tₙ(q) = ⁰T₁(q₁) ··· ⁿ⁻¹Tₙ(qₙ)'
  },
  {
    id: 3,
    category: '运动学',
    index: '03',
    title: '雅可比矩阵',
    brief: '连接关节速度与末端速度，也是奇异性分析和力控制的关键。',
    tags: ['Jacobian', '奇异性', '速度映射'],
    level: '进阶', time: '16 min',
    content: [
      '雅可比矩阵是末端位姿对关节变量的一阶微分映射，将关节速度映射为末端线速度和角速度。',
      '当雅可比矩阵降秩时，机器人处于奇异构型：末端会丢失某些运动方向，同时逆解数值可能剧烈变化。',
      '在静力学中，雅可比转置建立末端广义力与关节力矩之间的关系。'
    ],
    formula: 'ẋ = J(q)q̇  ·  τ = Jᵀ(q)F'
  },
  {
    id: 4,
    category: '动力学',
    index: '04',
    title: '机器人动力学方程',
    brief: '理解惯性、科氏力、重力与关节驱动力之间的关系。',
    tags: ['拉格朗日', '惯性矩阵', '逆动力学'],
    level: '进阶', time: '22 min',
    content: [
      '动力学描述力与运动的因果关系。常见建模方法包括拉格朗日法与 Newton–Euler 递推法。',
      '惯性矩阵 M(q) 对称正定；C(q,q̇)q̇ 表示科氏力与离心力；g(q) 表示重力项。',
      '逆动力学根据期望运动计算所需力矩，是计算力矩控制与前馈补偿的基础。'
    ],
    formula: 'M(q)q̈ + C(q,q̇)q̇ + g(q) = τ'
  },
  {
    id: 5,
    category: '控制',
    index: '05',
    title: 'PID 控制器',
    brief: '经典、可靠且实用：从误差反馈到抗积分饱和与参数整定。',
    tags: ['反馈控制', '参数整定', '抗饱和'],
    level: '基础', time: '15 min',
    content: [
      '比例项快速响应当前误差，积分项消除稳态误差，微分项预测误差趋势并增加阻尼。',
      '工程实现要考虑采样周期、测量噪声、执行器限幅和积分饱和。微分项通常对测量值计算并加低通滤波。',
      '整定时可先关闭 I、D，从 P 开始获得足够响应，再加入 D 抑制振荡，最后用少量 I 消除静差。'
    ],
    formula: 'u(t)=Kₚe(t)+Kᵢ∫e(t)dt+K_d de(t)/dt'
  },
  {
    id: 6,
    category: '控制',
    index: '06',
    title: '状态空间与 LQR',
    brief: '用系统状态统一描述多输入多输出系统，并优化控制性能。',
    tags: ['状态空间', '最优控制', 'Riccati'],
    level: '进阶', time: '20 min',
    content: [
      '状态空间模型使用一阶微分方程描述动态系统，适合处理多输入、多输出以及内部状态。',
      'LQR 通过最小化状态偏差与控制能量的加权二次型代价，得到线性状态反馈 u = −Kx。',
      'Q 与 R 并非越大越好：增大 Q 中某个状态权重会更积极地压制该状态，增大 R 则让控制更保守。'
    ],
    formula: 'J = ∫(xᵀQx + uᵀRu)dt'
  },
  {
    id: 7,
    category: '感知与规划',
    index: '07',
    title: '卡尔曼滤波',
    brief: '在动态模型与含噪观测之间，递推估计系统的最优状态。',
    tags: ['状态估计', '传感器融合', 'EKF'],
    level: '进阶', time: '19 min',
    content: [
      '卡尔曼滤波由预测与更新两步构成：先用运动模型外推，再用新观测校正。',
      '协方差表达估计的不确定性。过程噪声 Q 越大，滤波器越不信任模型；观测噪声 R 越大，则越不信任传感器。',
      '线性高斯系统使用标准 KF，非线性系统常用 EKF、UKF；工程中必须关注时间同步与坐标系变换。'
    ],
    formula: 'x̂ₖ = x̂ₖ⁻ + Kₖ(zₖ − Hx̂ₖ⁻)'
  },
  {
    id: 8,
    category: '感知与规划',
    index: '08',
    title: '路径规划：A* 与 RRT*',
    brief: '在离散地图或连续空间中，寻找安全、可执行的运动路径。',
    tags: ['A*', 'RRT*', '碰撞检测'],
    level: '进阶', time: '21 min',
    content: [
      'A* 在图上以 f(n)=g(n)+h(n) 选择扩展节点，启发函数不高估真实代价时可保证最优。',
      'RRT 通过随机采样快速探索高维连续空间，RRT* 进一步重连节点，使路径代价渐近最优。',
      '几何路径还需经过平滑、时间参数化与动力学约束检查，才能成为机器人可执行轨迹。'
    ],
    formula: 'f(n) = g(n) + h(n)'
  },
]

const routes = [
  { n: '01', title: '数学与坐标', text: '线性代数 · 位姿表示 · 刚体变换' },
  { n: '02', title: '建模与运动', text: '运动学 · 雅可比 · 动力学' },
  { n: '03', title: '反馈与估计', text: 'PID · 状态空间 · 卡尔曼滤波' },
  { n: '04', title: '智能与实践', text: '路径规划 · ROS 2 · 仿真部署' },
]

function RobotVisual() {
  return (
    <div className="robot-visual" aria-hidden="true">
      <div className="orbit orbit-a" /><div className="orbit orbit-b" />
      <svg viewBox="0 0 520 420" role="img">
        <defs><linearGradient id="arm" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d9ff4f"/><stop offset="1" stopColor="#a6d71a"/></linearGradient></defs>
        <path className="gridline" d="M30 352H490M63 308H460M98 264H425M132 220H390M167 176H355" />
        <path className="gridline" d="M83 380L213 108M162 380L241 108M241 380L269 108M320 380L297 108M399 380L325 108" />
        <ellipse cx="270" cy="364" rx="105" ry="22" fill="#0c1714" opacity=".14"/>
        <path d="M197 348h148l24 31H171z" fill="#11201d"/><rect x="210" y="325" width="122" height="33" rx="8" fill="#20302c"/>
        <g className="arm-piece"><path d="M263 329l-13-123 48-4 23 128z" fill="url(#arm)"/><circle cx="276" cy="207" r="31" fill="#172723"/><circle cx="276" cy="207" r="15" fill="#d9ff4f"/></g>
        <g className="arm-piece delay"><path d="M279 187l64-93 37 25-70 102z" fill="url(#arm)"/><circle cx="361" cy="105" r="27" fill="#172723"/><circle cx="361" cy="105" r="12" fill="#d9ff4f"/></g>
        <g className="arm-piece delay2"><path d="M374 93l78 57-22 35-84-60z" fill="url(#arm)"/><circle cx="442" cy="168" r="24" fill="#172723"/></g>
        <path d="M455 165l28-20 10 13-24 22 19 16-10 12-31-27z" fill="#d9ff4f"/>
        <circle cx="122" cy="108" r="5" fill="#d9ff4f"/><circle cx="423" cy="61" r="4" fill="#d9ff4f"/><circle cx="96" cy="238" r="3" fill="#d9ff4f"/>
        <path d="M122 108h75M423 61h-46M96 238h75" stroke="#6d7e78" strokeDasharray="4 5"/>
        <text x="78" y="94">FRAME 01</text><text x="399" y="47">JOINT 03</text><text x="53" y="224">BASE</text>
      </svg>
      <div className="status-pill"><span /> SYSTEM ONLINE</div>
    </div>
  )
}

function App() {
  const [active, setActive] = useState('全部')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [menu, setMenu] = useState(false)

  const filtered = useMemo(() => notes.filter(n => {
    const inCategory = active === '全部' || n.category === active
    const q = query.trim().toLowerCase()
    const inSearch = !q || [n.title, n.brief, n.category, ...n.tags].join(' ').toLowerCase().includes(q)
    return inCategory && inSearch
  }), [active, query])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return <>
    <header>
      <a className="brand" href="#top"><span className="brand-mark"><Bot size={20}/></span><span>ROBOT<em>NOTES</em></span></a>
      <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="打开菜单">{menu ? <X/> : <Menu/>}</button>
      <nav className={menu ? 'open' : ''}>
        <a href="#knowledge" onClick={() => setMenu(false)}>知识库</a>
        <a href="#route" onClick={() => setMenu(false)}>学习路径</a>
        <a href="#about" onClick={() => setMenu(false)}>关于</a>
      </nav>
      <a className="github-link" href="https://github.com/zhichengkou/robot-notes" target="_blank" rel="noreferrer"><Github size={18}/> GitHub</a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> ROBOTICS KNOWLEDGE BASE</div>
          <h1>理解机器人，<br/><span>从每一个原理开始。</span></h1>
          <p>将复杂的机器人学拆解成清晰、可检索的知识卡片。<br className="desktop"/>从数学基础到智能控制，建立属于你的知识体系。</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#knowledge">开始探索 <ArrowRight size={18}/></a>
            <a className="text-btn" href="#route">查看学习路径 <ChevronRight size={18}/></a>
          </div>
          <div className="hero-stats">
            <div><strong>{notes.length}</strong><span>核心知识点</span></div>
            <div><strong>5</strong><span>知识领域</span></div>
            <div><strong>持续</strong><span>开放更新</span></div>
          </div>
        </div>
        <RobotVisual/>
      </section>

      <section className="knowledge" id="knowledge">
        <div className="section-heading">
          <div><span className="section-no">01 / KNOWLEDGE</span><h2>知识索引</h2><p>从基础概念到实际应用，按主题快速定位。</p></div>
          <label className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索知识点、标签..."/><kbd>⌘ K</kbd></label>
        </div>
        <div className="category-tabs">
          {categories.map(c => { const Icon = c.icon; return <button key={c.id} className={active === c.id ? 'active' : ''} onClick={() => setActive(c.id)}><Icon size={17}/>{c.id}</button> })}
        </div>
        <div className="card-grid">
          {filtered.map(note => <article className="note-card" key={note.id} onClick={() => setSelected(note)} tabIndex="0" onKeyDown={e => e.key === 'Enter' && setSelected(note)}>
            <div className="card-top"><span className="card-index">{note.index}</span><span className={`level ${note.level === '基础' ? 'basic' : ''}`}>{note.level}</span></div>
            <div className="card-icon">{note.category === '控制' ? <CircleGauge/> : note.category === '感知与规划' ? <BrainCircuit/> : note.category === '动力学' ? <Boxes/> : <Network/>}</div>
            <h3>{note.title}</h3><p>{note.brief}</p>
            <div className="tag-row">{note.tags.slice(0,2).map(t => <span key={t}>#{t}</span>)}</div>
            <div className="card-footer"><span>{note.category} · {note.time}</span><button aria-label="查看详情"><ArrowRight size={18}/></button></div>
          </article>)}
        </div>
        {!filtered.length && <div className="empty"><Search/><h3>没有找到相关知识点</h3><p>试试更换关键词或分类。</p></div>}
      </section>

      <section className="route" id="route">
        <div className="route-intro"><span className="section-no">02 / ROADMAP</span><h2>一条清晰的<br/>机器人学习路径</h2><p>知识不是孤岛。按照由数学基础到系统实践的顺序，逐步建立完整认知。</p><div className="route-badge"><Target/>建议每周完成 1 个阶段</div></div>
        <div className="route-list">
          {routes.map((r, i) => <div className="route-item" key={r.n}><span>{r.n}</span><div><h3>{r.title}</h3><p>{r.text}</p></div><div className="route-line"><i style={{width: `${35 + i * 18}%`}}/></div><Zap size={20}/></div>)}
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-icon"><Bot size={36}/></div><span className="section-no">OPEN KNOWLEDGE</span>
        <h2>把复杂知识，讲得足够清楚。</h2>
        <p>Robot Notes 是一个开放的机器人学习笔记项目。内容力求准确、直观，也欢迎你通过 GitHub 参与补充和修正。</p>
        <a href="https://github.com/zhichengkou/robot-notes" target="_blank" rel="noreferrer">在 GitHub 上参与 <ArrowRight size={18}/></a>
      </section>
    </main>

    <footer><a className="brand" href="#top"><span className="brand-mark"><Bot size={18}/></span><span>ROBOT<em>NOTES</em></span></a><p>机器人知识，系统化地学。</p><span>© 2026 ROBOT NOTES</span></footer>

    {selected && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setSelected(null)}>
      <article className="modal">
        <button className="modal-close" onClick={() => setSelected(null)} aria-label="关闭"><X/></button>
        <div className="modal-meta"><span>{selected.index}</span><b>{selected.category}</b><i>{selected.level} · {selected.time}</i></div>
        <h2>{selected.title}</h2><p className="modal-lead">{selected.brief}</p>
        <div className="formula">{selected.formula}</div>
        <div className="modal-content">{selected.content.map((p, i) => <div key={p}><span>0{i+1}</span><p>{p}</p></div>)}</div>
        <div className="modal-tags">{selected.tags.map(t => <span key={t}>#{t}</span>)}</div>
      </article>
    </div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
