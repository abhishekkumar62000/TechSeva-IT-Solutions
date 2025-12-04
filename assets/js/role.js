// role.js — populate role detail page (role.html)
(function(){
  // small utility to read ?role=...
  function qs(name){ const params = new URLSearchParams(location.search); return params.get(name); }

  const roleKey = qs('role') || 'Web Development';

  // Data: 5 projects per role (2 easy, 3 intermediate)
  const roles = {
    'Web Development': {
      summary: 'Build frontend features, small UI components and a deployed demo with GitHub repo.',
      projects: [
        { title: 'Landing Page Revamp', difficulty: 'Easy', desc: 'Create a responsive landing page using HTML/CSS following a provided wireframe.', tasks: ['Build header and hero','Responsive layout for mobile/tablet/desktop','Add accessible forms'], deliverables: ['GitHub repo','Live demo (GitHub Pages)','README with screenshots'], days: 5 },
        { title: 'Interactive Contact Form', difficulty: 'Easy', desc: 'Create a contact form with client-side validation and submission to a mock endpoint.', tasks: ['Form markup & styles','Validation (JS)','Mock submit & success state'], deliverables: ['Code in repo','README with usage'], days: 3 },
        { title: 'Mini SPA — Portfolio', difficulty: 'Intermediate', desc: 'Build a small single page app (vanilla JS or framework) showcasing projects with routing and state.', tasks: ['Project list and details','Client-side routing','State persistence'], deliverables: ['Repo with dev and build scripts','Deployed demo link','README'], days: 10 },
        { title: 'Performance Optimization', difficulty: 'Intermediate', desc: 'Audit a small site, fix images and load ordering, and improve Lighthouse score.', tasks: ['Image optimization','Lazy loading','Minify and cache headers (explain)'], deliverables: ['Before/after report','Updated repo'], days: 7 },
        { title: 'Feature: Theme Toggle & Accessibility', difficulty: 'Intermediate', desc: 'Add dark/light theme and ensure basic accessibility improvements.', tasks: ['Theme toggle with CSS variables','Keyboard focus states','ARIA attributes for landmark regions'], deliverables: ['Repo changes','Accessibility checklist in README'], days: 6 },
        { title: 'Client Mini-Project', difficulty: 'Intermediate', desc: 'End-to-end mini client project: implement a small feature (landing + CTA) from requirements to deployment.', tasks: ['Gather simple requirements','Implement responsive UI and JS','Deploy demo and document'], deliverables: ['GitHub repo','Live demo URL','Case study section in README'], days: 10 }
      ]
    },

    'App Development': {
      summary: 'Implement small mobile UI tasks, build a simple feature and share an APK or hosted preview.',
      projects: [
        { title: 'App UI Screens', difficulty: 'Easy', desc: 'Implement 3 screens from designs using Flutter/React Native or native UI.', tasks: ['Login screen','Dashboard mockup','Profile screen'], deliverables: ['Repo','Screenshots or APK'], days: 5 },
        { title: 'In-app Form & Validation', difficulty: 'Easy', desc: 'Create a settings form with validation and local persistence.', tasks: ['Form UI','Validation','Persist to local storage/async storage'], deliverables: ['Repo','README'], days: 3 },
        { title: 'API Integration', difficulty: 'Intermediate', desc: 'Connect app to a sample REST API for listing items and showing details.', tasks: ['Fetch and display list','Pull-to-refresh','Error handling'], deliverables: ['Repo','Demo video or hosted build'], days: 9 },
        { title: 'Push Notifications (Prototype)', difficulty: 'Intermediate', desc: 'Prototype push notifications using a test service or emulator.', tasks: ['Setup notification library','Receive and handle notification','Document setup'], deliverables: ['Repo','Instructions for testing'], days: 7 },
        { title: 'App Testing & CI', difficulty: 'Intermediate', desc: 'Add basic unit/e2e tests and show a simple CI workflow.', tasks: ['Unit tests','Basic e2e (if possible)','CI pipeline example'], deliverables: ['Repo with tests','CI config (GitHub Actions)'], days: 8 },
        { title: 'End-to-End Feature', difficulty: 'Intermediate', desc: 'Build and deliver a small feature from requirement to release, including basic testing.', tasks: ['Design the feature flow','Implement UI and business logic','Document and produce a release build'], deliverables: ['Repo with build','APK or hosted demo','Release notes in README'], days: 10 }
      ]
    },

    'UI/UX': {
      summary: 'Research, wireframe and prototype a small product flow with user testing notes.',
      projects: [
        { title: 'Wireframe: Onboarding Flow', difficulty: 'Easy', desc: 'Create low-fidelity wireframes for onboarding and document user journey.', tasks: ['3–5 screens wireframed','User journey map','Annotate interactions'], deliverables: ['Figma link or images','README describing choices'], days: 4 },
        { title: 'Visual Mockup', difficulty: 'Easy', desc: 'High-fidelity mockup for one key screen with responsive states.', tasks: ['Typography & color choices','Component states','Export assets'], deliverables: ['Figma/PNG','Style notes in README'], days: 3 },
        { title: 'Prototype & Usability Test', difficulty: 'Intermediate', desc: 'Build clickable prototype and run 3 usability tests, synthesize findings.', tasks: ['Prototype in Figma','Recruit 3 testers','Synthesize into insights'], deliverables: ['Prototype link','Test notes & improvements'], days: 10 },
        { title: 'Design System Starter', difficulty: 'Intermediate', desc: 'Create a small design token set and components for reuse.', tasks: ['Colors & type scale','Button variants','Component docs'], deliverables: ['Design system files','README'], days: 7 },
        { title: 'Accessibility Audit', difficulty: 'Intermediate', desc: 'Audit a page for accessibility and apply fixes.', tasks: ['Run automated/a11y checks','Fix contrast/labels','Keyboard navigation'], deliverables: ['Audit report','Updated mockups or code'], days: 6 },
        { title: 'Design Case Study', difficulty: 'Intermediate', desc: 'Produce a full design case study combining research, prototype and testing for one flow.', tasks: ['Conduct quick research','Prototype in Figma','Perform 3 usability tests and synthesize learnings'], deliverables: ['Case study PDF','Prototype link','README with learnings'], days: 10 }
      ]
    },

    'AI/ML': {
      summary: 'Work with a small dataset, train a simple model and present evaluation results.',
      projects: [
        { title: 'Data Cleaning & EDA', difficulty: 'Easy', desc: 'Perform exploratory data analysis and cleaning on a sample dataset.', tasks: ['Inspect dataset','Clean missing values','Visualize distributions'], deliverables: ['Notebook','README with EDA'], days: 4 },
        { title: 'Baseline Model', difficulty: 'Easy', desc: 'Train a simple baseline model (e.g., logistic regression) and report metrics.', tasks: ['Train baseline','Evaluate metrics','Save model artifacts'], deliverables: ['Notebook/Script','Results in README'], days: 5 },
        { title: 'Model Improvement', difficulty: 'Intermediate', desc: 'Try feature engineering and a stronger model, compare with baseline.', tasks: ['Feature creation','Train tuned model','Compare metrics'], deliverables: ['Notebook','Comparison report'], days: 9 },
        { title: 'Experiment Tracking', difficulty: 'Intermediate', desc: 'Use simple experiment logging to track runs and hyperparameters.', tasks: ['Integrate logging','Record runs','Visualize results'], deliverables: ['Repo','Run logs'], days: 7 },
        { title: 'Mini Deployment', difficulty: 'Intermediate', desc: 'Wrap model in a lightweight API and provide demo instructions.', tasks: ['Simple Flask/FastAPI wrapper','Example inference script','Run instructions'], deliverables: ['Repo','Demo endpoint (local)'], days: 8 },
        { title: 'Business Problem Mini-Project', difficulty: 'Intermediate', desc: 'Solve a small business problem end-to-end: define, model and present results in a short report.', tasks: ['Define measurable objective','Train & evaluate model','Prepare presentation slides with recommendations'], deliverables: ['Notebook','Presentation slides','README with conclusions'], days: 10 }
      ]
    },

    'Content Creator': {
      summary: 'Produce content pieces and create a content plan with measurable metrics.',
      projects: [
        { title: 'Blog Draft', difficulty: 'Easy', desc: 'Write a 800–1200 word blog post on an assigned topic.', tasks: ['Draft outline','Write post','SEO basics'], deliverables: ['Markdown file','Publish-ready images'], days: 4 },
        { title: 'Social Post Series', difficulty: 'Easy', desc: 'Create 3 social media posts with captions and images for LinkedIn/Instagram.', tasks: ['Write captions','Design images','Schedule plan'], deliverables: ['Assets','Post calendar'], days: 3 },
        { title: 'Content Repurposing', difficulty: 'Intermediate', desc: 'Turn a blog into a thread, short video script and image assets.', tasks: ['Extract highlights','Create video script','Design assets'], deliverables: ['Thread draft','Video storyboard'], days: 7 },
        { title: 'SEO Optimization', difficulty: 'Intermediate', desc: 'Optimize an existing post for search and measure impact.', tasks: ['Keyword research','On-page SEO','Update post'], deliverables: ['SEO checklist','Before/after metrics'], days: 6 },
        { title: 'Editorial Plan', difficulty: 'Intermediate', desc: 'Build a 4-week content calendar aligned to goals.', tasks: ['Plan topics','Assign formats','KPIs per post'], deliverables: ['Calendar','Execution notes'], days: 6 },
        { title: 'Campaign Case Study', difficulty: 'Intermediate', desc: 'Run a short content campaign and document results and learnings.', tasks: ['Plan campaign','Create posts & assets','Measure and report KPIs'], deliverables: ['Campaign assets','Performance report','README case study'], days: 8 }
      ]
    },

    'Social Media': {
      summary: 'Create campaigns, schedule posts and analyze engagement for a small campaign.',
      projects: [
        { title: 'Post Series Creation', difficulty: 'Easy', desc: 'Create 5 engaging posts for a campaign.', tasks: ['Write copy','Design images','Hashtag research'], deliverables: ['Assets','Scheduling plan'], days: 4 },
        { title: 'Engagement Boost', difficulty: 'Easy', desc: 'Run manual engagement improvements (reply flows, CTAs) and measure change.', tasks: ['Reply templates','CTA testing','Measure engagement'], deliverables: ['Report','Samples'], days: 3 },
        { title: 'Analytics Report', difficulty: 'Intermediate', desc: 'Analyze campaign performance and recommend improvements.', tasks: ['Collect metrics','Visualize results','Suggest changes'], deliverables: ['Report','Action plan'], days: 7 },
        { title: 'A/B Test Creatives', difficulty: 'Intermediate', desc: 'Run A/B test for two creatives and document result.', tasks: ['Prepare variants','Run test','Analyze result'], deliverables: ['Test report','Recommended creative'], days: 8 },
        { title: 'Community Growth Plan', difficulty: 'Intermediate', desc: 'Draft a plan to grow an engaged community for 3 months.', tasks: ['Audience research','Content pillars','Engagement tactics'], deliverables: ['Plan document','Schedule'], days: 9 },
        { title: 'Mini Campaign Case', difficulty: 'Intermediate', desc: 'Design and analyze a focused 1-week campaign and report on learnings.', tasks: ['Create campaign assets','Schedule & run posts','Collect metrics and analyze'], deliverables: ['Assets','Campaign analytics report','README summary'], days: 7 }
      ]
    },

    'WordPress': {
      summary: 'Set up pages, fix theme issues and implement small plugin/feature tasks.',
      projects: [
        { title: 'Page Build', difficulty: 'Easy', desc: 'Create 3 pages with given content and template adjustments.', tasks: ['Page templates','Responsive checks','Image optimization'], deliverables: ['Site preview','Repo or backup'], days: 4 },
        { title: 'Plugin Setup', difficulty: 'Easy', desc: 'Install/configure a plugin and document settings.', tasks: ['Install plugin','Configure','Test functionality'], deliverables: ['Config notes','Screenshots'], days: 3 },
        { title: 'Theme Customization', difficulty: 'Intermediate', desc: 'Implement child theme changes and custom styles.', tasks: ['Child theme','CSS tweaks','Template edits'], deliverables: ['Theme diff','README'], days: 7 },
        { title: 'Performance Fixes', difficulty: 'Intermediate', desc: 'Improve site speed via caching and asset optimization.', tasks: ['Enable caching','Optimize images','Minify assets'], deliverables: ['Before/after report'], days: 6 },
        { title: 'Security Hardening', difficulty: 'Intermediate', desc: 'Apply basic security best practices and document.', tasks: ['Update core/plugins','Set file perms','Add login protections'], deliverables: ['Security checklist','Notes'], days: 8 },
        { title: 'Client Mini-site', difficulty: 'Intermediate', desc: 'Build a small client-facing site end-to-end (setup, customization, deployment).', tasks: ['Install & configure theme','Customize templates','Optimize and document deployment'], deliverables: ['Site preview or backup','Documentation in README'], days: 10 }
      ]
    },

    'Data Entry': {
      summary: 'Clean and structure datasets, build templates and simple automations.',
      projects: [
        { title: 'Spreadsheet Template', difficulty: 'Easy', desc: 'Create a reusable spreadsheet template with validations.', tasks: ['Columns & types','Validation rules','Sample data'], deliverables: ['Template file','README'], days: 3 },
        { title: 'Data Cleaning', difficulty: 'Easy', desc: 'Clean small dataset and document steps.', tasks: ['Remove duplicates','Normalize values','Summary stats'], deliverables: ['Clean dataset','QA notes'], days: 4 },
        { title: 'Automation Script', difficulty: 'Intermediate', desc: 'Create a script to transform CSV files automatically.', tasks: ['Script in Python/Node','Test cases','Usage guide'], deliverables: ['Repo','Instructions'], days: 7 },
        { title: 'Validation & QA', difficulty: 'Intermediate', desc: 'Build QA checks and sample report for data quality.', tasks: ['Validation rules','Automated checks','Report template'], deliverables: ['QA script','Report examples'], days: 6 },
        { title: 'Dashboard Snapshot', difficulty: 'Intermediate', desc: 'Prepare a small dashboard snapshot with key metrics.', tasks: ['Aggregate metrics','Design chart','Export snapshot'], deliverables: ['Dashboard file','README'], days: 8 },
        { title: 'ETL Pipeline Script', difficulty: 'Intermediate', desc: 'Create a small ETL script to transform raw CSV into a cleaned dataset automatically.', tasks: ['Write transformation script','Add simple tests','Provide usage docs'], deliverables: ['Repo with script','Cleaned sample dataset','README with run instructions'], days: 7 }
      ]
    }
    ,
    'Data Science': {
      summary: 'Work with real datasets to explore, model and communicate results using Python and notebooks.',
      projects: [
        { title: 'EDA & Cleaning', difficulty: 'Easy', desc: 'Explore a dataset, clean missing values and prepare a summary notebook.', tasks: ['Load dataset','Clean missing/erroneous values','Visualize distributions'], deliverables: ['Notebook (Jupyter)','README with key findings'], days: 5 },
        { title: 'Simple Predictive Model', difficulty: 'Easy', desc: 'Train a baseline model and report performance metrics.', tasks: ['Split data','Train baseline model','Report metrics'], deliverables: ['Notebook','Model artifacts list'], days: 6 },
        { title: 'Feature Engineering', difficulty: 'Intermediate', desc: 'Create meaningful features and evaluate improvement over baseline.', tasks: ['Create features','Retrain models','Compare results'], deliverables: ['Updated notebook','Feature description in README'], days: 8 },
        { title: 'Model Interpretation', difficulty: 'Intermediate', desc: 'Produce interpretable insights using SHAP or similar and write a short report.', tasks: ['Run interpretable analysis','Visualize feature importances','Write interpretation notes'], deliverables: ['Report','Notebook'], days: 7 },
        { title: 'Mini Deployment', difficulty: 'Intermediate', desc: 'Wrap an inference endpoint and provide demo instructions.', tasks: ['Create Flask/FastAPI endpoint','Example inference script','Deployment README'], deliverables: ['Repo','Run instructions'], days: 9 },
        { title: 'Business Impact Project', difficulty: 'Intermediate', desc: 'Apply data science to a small business case and deliver actionable recommendations.', tasks: ['Define KPI and goals','Model and evaluate','Prepare recommendations for stakeholders'], deliverables: ['Notebook','Presentation','README with business impact'], days: 10 }
      ]
    },

    'Data Analyst': {
      summary: 'Analyze business data, create dashboards and deliver actionable insights using SQL, Excel and visualization tools.',
      projects: [
        { title: 'Data Cleaning Template', difficulty: 'Easy', desc: 'Prepare a reusable cleaning template and sample cleaned dataset.', tasks: ['Define schema','Normalize values','Provide sample scripts'], deliverables: ['Template file','README'], days: 4 },
        { title: 'Exploratory Report', difficulty: 'Easy', desc: 'Produce an exploratory analysis and slide deck of insights.', tasks: ['Analyze metrics','Create charts','Summarize findings'], deliverables: ['Report PDF','Charts folder'], days: 5 },
        { title: 'SQL Analysis', difficulty: 'Intermediate', desc: 'Write SQL queries to answer business questions and optimize them.', tasks: ['Write queries','Optimize joins/aggregations','Document assumptions'], deliverables: ['SQL scripts','Analysis README'], days: 7 },
        { title: 'Dashboard Prototype', difficulty: 'Intermediate', desc: 'Build a dashboard in Tableau/Power BI/Looker Studio showing key KPIs.', tasks: ['Model data','Design visuals','Add interactivity'], deliverables: ['Dashboard file or link','README'], days: 9 },
        { title: 'A/B Test Analysis', difficulty: 'Intermediate', desc: 'Analyze an A/B test dataset and provide statistical conclusions.', tasks: ['Define metrics','Run tests','Summarize results'], deliverables: ['Analysis notebook','Conclusion report'], days: 8 },
        { title: 'End-to-End Analysis', difficulty: 'Intermediate', desc: 'Take raw data through cleaning, analysis and dashboarding to produce a business-ready insight.', tasks: ['Ingest & clean data','Analyze & visualize','Create dashboard and summary'], deliverables: ['Scripts/notebook','Dashboard or visuals','README with recommendations'], days: 8 }
      ]
    },

    'Power BI': {
      summary: 'Design Power BI reports, build data models and publish interactive dashboards for stakeholders.',
      projects: [
        { title: 'Power BI — Data Model', difficulty: 'Easy', desc: 'Create a simple data model and relationships for a sample dataset.', tasks: ['Import data','Define relationships','Create calculated columns'], deliverables: ['PBIX file','README'], days: 4 },
        { title: 'Visual Report', difficulty: 'Easy', desc: 'Design 3 report pages highlighting key metrics and filters.', tasks: ['Create visuals','Add slicers/filters','Format for clarity'], deliverables: ['PBIX file','Screenshots'], days: 5 },
        { title: 'DAX Measures', difficulty: 'Intermediate', desc: 'Implement DAX measures for complex KPIs and time intelligence.', tasks: ['Write DAX measures','Validate results','Document formulas'], deliverables: ['PBIX file','DAX notes'], days: 7 },
        { title: 'Performance Tuning', difficulty: 'Intermediate', desc: 'Optimize report performance and dataset size.', tasks: ['Optimize model','Use aggregations','Test performance improvements'], deliverables: ['Before/after notes','Updated PBIX'], days: 8 },
        { title: 'Publish & Share', difficulty: 'Intermediate', desc: 'Publish to Power BI Service and configure share settings and row-level security (sample).', tasks: ['Publish report','Configure workspace','Document sharing'], deliverables: ['Service link or steps','README'], days: 9 },
        { title: 'End-to-End Report', difficulty: 'Intermediate', desc: 'Build a complete report from model to visuals and document publishing steps.', tasks: ['Model data and create measures','Design visuals & interactions','Document publishing and sharing'], deliverables: ['PBIX file','Publishing steps in README','Sample screenshots'], days: 8 }
      ]
    },

    'Generative AI': {
      summary: 'Prototype generative AI features with LLMs, prompt engineering and evaluation for creative or automation tasks.',
      projects: [
        { title: 'Prompting Basics', difficulty: 'Easy', desc: 'Build prompts for a small task (summarization or template generation) and compare variations.', tasks: ['Design prompts','Run comparisons','Document outcomes'], deliverables: ['Notebook or script','Prompt notes'], days: 4 },
        { title: 'Text Generation Demo', difficulty: 'Easy', desc: 'Create a small web demo that uses an LLM to generate content (e.g., blog outlines).', tasks: ['Setup API calls','Create minimal UI','Handle safety/length'], deliverables: ['Repo','Demo link/instructions'], days: 6 },
        { title: 'Fine-tune or Retrieval', difficulty: 'Intermediate', desc: 'Implement retrieval-augmented generation or a small fine-tune workflow for targeted responses.', tasks: ['Prepare knowledge base','Implement RAG or fine-tune flow','Evaluate accuracy'], deliverables: ['Repo','Evaluation report'], days: 9 },
        { title: 'Safety & Bias Check', difficulty: 'Intermediate', desc: 'Run bias/safety checks and prepare mitigation steps for model outputs.', tasks: ['Define checks','Run tests','Document mitigations'], deliverables: ['Report','Updated prompts/policies'], days: 7 },
        { title: 'Integration Prototype', difficulty: 'Intermediate', desc: 'Integrate a generative feature into a small app or workflow (chatbot, content assistant).', tasks: ['Build integration','Handle rate/latency','Document usage'], deliverables: ['Repo','Demo instructions'], days: 10 },
        { title: 'Prototype to Product', difficulty: 'Intermediate', desc: 'Refine a generative prototype into a small usable demo with evaluation and user-facing instructions.', tasks: ['Refine prompts and flows','Create a minimal UI integration','Evaluate outputs and document limitations'], deliverables: ['Repo','Demo link or run instructions','README with evaluation notes'], days: 10 }
      ]
    }
  };

  // DOM references
  const titleEl = document.getElementById('roleTitle');
  const summaryEl = document.getElementById('roleSummary');
  const projectsList = document.getElementById('projectsList');
  const instructionsBody = document.getElementById('instructionsBody');
  const readmeContent = document.getElementById('readmeContent');
  const copyReadmeBtn = document.getElementById('copyReadme');
  const shareLinkedIn = document.getElementById('shareLinkedIn');
  const openQuickQuiz = document.getElementById('openQuickQuiz');
  const quizModal = document.getElementById('role-quiz-modal');
  const quizContent = document.getElementById('roleQuizContent');
  const closeRoleQuiz = document.getElementById('closeRoleQuiz');
  const roleSubmitQuiz = document.getElementById('roleSubmitQuiz');
  const roleCancelQuiz = document.getElementById('roleCancelQuiz');
  const roleQuizResult = document.getElementById('roleQuizResult');

  const data = roles[roleKey] || roles['Web Development'];

  // Populate header
  titleEl.textContent = roleKey;
  summaryEl.textContent = data.summary || '';

  // Snapshot
  const easyCount = (data.projects || []).filter(p => p.difficulty === 'Easy').length;
  const interCount = (data.projects || []).filter(p => p.difficulty === 'Intermediate').length;
  const snapshot = document.getElementById('projectSnapshot');
  if(snapshot) snapshot.textContent = `${easyCount} easy project(s) and ${interCount} intermediate project(s).`;

  // Projects list
  // New: interactive project card with checklist, progress, persistence
  function buildProjectCard(p, idx){
    const wrap = document.createElement('div'); wrap.className = 'project-card'; wrap.style.background = '#fff'; wrap.style.padding = '14px'; wrap.style.borderRadius = '10px'; wrap.style.boxShadow = 'var(--shadow)'; wrap.dataset.project = p.title;
    const h = document.createElement('h3'); h.textContent = (idx+1) + '. ' + p.title + ' — ' + p.difficulty; h.style.margin = '0 0 6px 0';
    wrap.appendChild(h);
    const d = document.createElement('p'); d.textContent = p.desc; d.style.margin = '0 0 10px 0'; d.style.color = 'var(--space-cadet-1)'; wrap.appendChild(d);

    // progress bar
    const meta = document.createElement('div'); meta.className = 'project-meta';
    const progressWrap = document.createElement('div'); progressWrap.className = 'progress-wrap'; progressWrap.style.flex = '1'; progressWrap.style.minWidth = '160px';
    const progressBar = document.createElement('div'); progressBar.className = 'progress-bar'; progressBar.style.width = '0%'; progressWrap.appendChild(progressBar);
    meta.appendChild(progressWrap);
    const estimated = document.createElement('div'); estimated.className = 'countdown'; estimated.textContent = p.days + ' day(s) suggested'; meta.appendChild(estimated);
    wrap.appendChild(meta);

    // task checklist
    const tasksWrap = document.createElement('div'); tasksWrap.className = 'task-list';
    const storageKey = 'ts_role_' + encodeURIComponent(roleKey) + '_proj_' + encodeURIComponent(p.title);
    function loadState(){ try{ return JSON.parse(localStorage.getItem(storageKey) || '{}'); }catch(e){ return {}; } }
    function saveState(s){ try{ localStorage.setItem(storageKey, JSON.stringify(s||{})); }catch(e){} }
    const state = loadState();
    p.tasks.forEach((t, ti)=>{
      const id = 'chk_' + idx + '_' + ti + '_' + Math.random().toString(36).slice(2,6);
      const label = document.createElement('label');
      const inp = document.createElement('input'); inp.type = 'checkbox'; inp.id = id; inp.style.marginTop='2px';
      const span = document.createElement('span'); span.textContent = t;
      label.appendChild(inp); label.appendChild(span);
      // restore
      if(state.tasks && state.tasks[ti]){ inp.checked = true; label.style.opacity = '0.6'; }
      inp.addEventListener('change', function(){
        const s = loadState(); s.tasks = s.tasks || {}; s.tasks[ti] = !!inp.checked; saveState(s); updateProgress(); if(inp.checked) label.style.opacity = '0.6'; else label.style.opacity = '1';
      });
      tasksWrap.appendChild(label);
    });
    wrap.appendChild(tasksWrap);

    // deliverables
    const deliver = document.createElement('div'); deliver.style.marginTop = '10px'; deliver.innerHTML = '<strong>Deliverables:</strong> ' + (p.deliverables || []).join(', ');
    wrap.appendChild(deliver);

    // actions
    const actions = document.createElement('div'); actions.style.marginTop = '12px'; actions.style.display='flex'; actions.style.justifyContent='space-between'; actions.style.alignItems='center';
    const left = document.createElement('div'); left.style.display='flex'; left.style.gap='8px';
    const start = document.createElement('a'); start.className='btn small'; start.textContent='Open README'; start.href='#readmeTemplate'; start.addEventListener('click', ()=>{ document.getElementById('readmeContent').scrollIntoView({behavior:'smooth'}); });
    const github = document.createElement('button'); github.className='btn small btn-ghost'; github.textContent='Mark as on GitHub';
    left.appendChild(start); left.appendChild(github);
    actions.appendChild(left);

    const right = document.createElement('div'); right.style.display='flex'; right.style.gap='8px';
    const completeBtn = document.createElement('button'); completeBtn.className='btn small'; completeBtn.textContent='Mark complete';
    const badge = document.createElement('div'); badge.className='completed-badge'; badge.style.display='none'; badge.textContent='COMPLETED';
    right.appendChild(badge); right.appendChild(completeBtn);
    actions.appendChild(right);

    wrap.appendChild(actions);

    // progress updater
    function updateProgress(){
      const checks = tasksWrap.querySelectorAll('input[type=checkbox]');
      const total = checks.length; let done = 0; checks.forEach(c=>{ if(c.checked) done++; });
      const pct = total ? Math.round((done/total)*100) : 0; progressBar.style.width = pct + '%';
      // save
      const s = loadState(); s.progress = pct; s.completed = s.completed || false; saveState(s);
      if(s.completed || pct === 100){ badge.style.display='inline-block'; } else { badge.style.display='none'; }
    }

    // restore completed state
    if(state && state.completed){ badge.style.display='inline-block'; }

    // mark complete handler
    completeBtn.addEventListener('click', function(){ const s = loadState(); s.completed = true; saveState(s); badge.style.display='inline-block'; completeBtn.textContent = 'Completed'; completeBtn.disabled = true; });
    github.addEventListener('click', function(){ const repo = prompt('Paste your GitHub repo URL for this project (public):'); if(repo){ const s = loadState(); s.repo = repo; saveState(s); github.textContent = 'Linked'; github.disabled = true; github.title = repo; } });

    // initialize progress and UI
    updateProgress();
    return wrap;
  }

  (data.projects || []).forEach((p, i) => projectsList.appendChild(buildProjectCard(p, i)));

  // entrance animation: stagger reveal
  (function staggerReveal(){
    const items = Array.from(document.querySelectorAll('#projectsList .project-card'));
    items.forEach((it, i) => { it.classList.add('anim-stagger'); setTimeout(()=> it.classList.add('visible'), 90 * i); });
  })();

  // Instructions + submission guidelines
  const instructionsHtml = `
  <h4>Step-by-step</h4>
  <ol>
    <li>Choose a project and fork the starter (or create a new repo).</li>
    <li>Work on tasks, commit often with clear messages.</li>
    <li>Create a detailed README (template below) and include screenshots.</li>
    <li>Push code to GitHub and make the repo public before submission.</li>
    <li>Share the GitHub repo link and a short reflection on LinkedIn (template below).</li>
  </ol>
  <h4>Submission deadline</h4>
  <p>Recommended completion: finish within 2–3 weeks from when you start. If selected for formal internship, mentors will set final deadlines.</p>
  <h4>How we evaluate</h4>
  <ul>
    <li>Code quality and structure</li>
    <li>Completeness of deliverables</li>
    <li>README clarity and documentation</li>
    <li>Ability to explain trade-offs and learning</li>
  </ul>
  `;
  instructionsBody.innerHTML = instructionsHtml;

  // README template
  const readmeTemplate = `# ${roleKey} — Project Title\n\nShort description of the project and problem statement.\n\n## Features\n- Feature 1\n- Feature 2\n\n## Setup\n1. git clone https://github.com/<your-username>/<repo>.git\n2. cd <repo>\n3. install / run steps (e.g., npm install && npm start)\n\n## Screenshots\nAdd screenshots or demo link here.\n\n## Tech stack\nList technologies used.\n\n## How to run tests\nExplain tests and how to run them.\n\n## Deployment\nProvide deployment steps or demo URL.\n\n## License\nAdd license info (if any).\n`;
  readmeContent.textContent = readmeTemplate;

  if(copyReadmeBtn){ copyReadmeBtn.addEventListener('click', function(){ try{ navigator.clipboard.writeText(readmeTemplate); copyReadmeBtn.textContent = 'Copied'; setTimeout(()=>copyReadmeBtn.textContent = 'Copy README', 1600); }catch(e){ alert('Copy not supported in this browser.'); } }); }

  // Submission checklist
  const checklist = [
    'Public GitHub repository with code',
    'Complete README with setup and screenshots',
    'Short demo link or instructions to run locally',
    'Single .zip or link with final deliverables (if requested)',
    'LinkedIn post sharing your project (sample below)'
  ];
  const checklistEl = document.getElementById('submissionChecklist');
  checklist.forEach(it => { const li = document.createElement('li'); li.textContent = it; checklistEl.appendChild(li); });

  // LinkedIn share
  const postTemplate = `I completed the ${roleKey} project: <PROJECT_TITLE>. Built using [stack]. Check it out: <GITHUB_LINK> — thanks to @TechSeva for mentorship!`;
  if(shareLinkedIn){ shareLinkedIn.addEventListener('click', function(e){ e.preventDefault(); const url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href) + '&summary=' + encodeURIComponent(postTemplate); window.open(url, '_blank', 'noopener'); }); }

  // Quick quiz: simple 5-question pop using questions from page-appropriate bank
  const quizBank = {
    'Web Development': [
      {q:'Which language structures web pages?', opts:['CSS','HTML','JS','SQL'], a:1},
      {q:'Which adds interactivity?', opts:['HTML','CSS','JS','SQL'], a:2},
      {q:'Tag for stylesheet?', opts:['<script>','<link>','<style>','<css>'], a:1},
      {q:'What is responsive design?', opts:['Same on all screens','Adapts to screen sizes','Server optimization','Database layout'], a:1},
      {q:'DOM stands for?', opts:['Document Object Model','Data Object Map','Dynamic Object Model','Document Oriented Map'], a:0}
    ],
    'Data Science': [
      {q:'What does EDA stand for?', opts:['Estimated Data Analysis','Exploratory Data Analysis','Enhanced Data Access','Embedded Data Algorithm'], a:1},
      {q:'Which library is commonly used for dataframes in Python?', opts:['numpy','pandas','matplotlib','requests'], a:1},
      {q:'Which metric is common for classification?', opts:['RMSE','Accuracy','IOU','BLEU'], a:1},
      {q:'Which plot shows distribution of a single variable?', opts:['Scatter','Histogram','Network','Sankey'], a:1},
      {q:'Which method helps explain model predictions?', opts:['SHAP','SASS','SVM','SOAP'], a:0}
    ],
    'Data Analyst': [
      {q:'Which SQL clause filters rows?', opts:['SELECT','WHERE','JOIN','GROUP BY'], a:1},
      {q:'A KPI is a?', opts:['Key Performance Indicator','Known Process Item','KPI is not used','Key Product Index'], a:0},
      {q:'Best chart for trend over time?', opts:['Bar chart','Line chart','Pie chart','Radar chart'], a:1},
      {q:'Which tool is used for dashboards?', opts:['Power BI','Notepad','cURL','Git'], a:0},
      {q:'What does ETL stand for?', opts:['Extract Transform Load','Evaluate Test Launch','Extract Transfer Load','Encrypt Transfer Load'], a:0}
    ],
    'Power BI': [
      {q:'Power BI files commonly use which extension?', opts:['.pbix','.docx','.xlsx','.pptx'], a:0},
      {q:'DAX is used for?', opts:['Styling visuals','Data modeling and measures','Network calls','Image editing'], a:1},
      {q:'Which feature adds interactivity?', opts:['Slicers','Comments','Headers','Footers'], a:0},
      {q:'Power Query is for?', opts:['Data transformation','User auth','Styling reports','Publishing'], a:0},
      {q:'Where do you publish reports?', opts:['Power BI Service','Local folder only','Not possible','CSV'], a:0}
    ],
    'Generative AI': [
      {q:'LLM stands for?', opts:['Large Language Model','Local Learning Module','Lightweight Language Model','Long Latency Model'], a:0},
      {q:'Prompt engineering is used to?', opts:['Design prompts for desired outputs','Train GPUs','Optimize DB queries','Create dashboards'], a:0},
      {q:'Token limits relate to?', opts:['Model input/output size','Disk usage','CPU cores','Network speed'], a:0},
      {q:'RAG stands for?', opts:['Retrieval-Augmented Generation','Random Access Generator','Runtime AI Graph','Recurrent Attention Gate'], a:0},
      {q:'A safety step for outputs is to?', opts:['Filter harmful content','Ignore outputs','Always auto-post','Disable logs'], a:0}
    ],
    'default': [
      {q:'This is a sample question?', opts:['A','B','C','D'], a:0}
    ]
  };

  function openQuiz(){
    const qset = quizBank[roleKey] || quizBank['default'];
    quizContent.innerHTML = '';
    qset.forEach((q, i)=>{
      const el = document.createElement('div'); el.style.marginBottom='10px';
      const p = document.createElement('p'); p.style.fontWeight='700'; p.textContent = (i+1) + '. ' + q.q; el.appendChild(p);
      q.opts.forEach((opt, oi)=>{ const id = 'rq_' + i + '_' + oi; const label = document.createElement('label'); label.style.display='block'; label.style.cursor='pointer'; label.style.margin='4px 0'; const inp = document.createElement('input'); inp.type='radio'; inp.name='rq_' + i; inp.value = oi; label.appendChild(inp); const span = document.createElement('span'); span.textContent = ' ' + opt; label.appendChild(span); el.appendChild(label); });
      quizContent.appendChild(el);
    });
    quizModal.style.display = 'flex'; quizModal.setAttribute('aria-hidden','false'); roleQuizResult.style.display='none';
  }

  if(openQuickQuiz) openQuickQuiz.addEventListener('click', openQuiz);
  if(closeRoleQuiz) closeRoleQuiz.addEventListener('click', function(){ quizModal.style.display='none'; quizModal.setAttribute('aria-hidden','true'); });
  if(roleCancelQuiz) roleCancelQuiz.addEventListener('click', function(){ quizModal.style.display='none'; quizModal.setAttribute('aria-hidden','true'); });
  if(roleSubmitQuiz) roleSubmitQuiz.addEventListener('click', function(){
    const qset = quizBank[roleKey] || quizBank['default']; let correct = 0; qset.forEach((q, i)=>{ const sel = quizContent.querySelector('input[name="rq_' + i + '"]:checked'); if(sel && parseInt(sel.value,10) === q.a) correct++; }); const pct = Math.round((correct / qset.length) * 100); roleQuizResult.style.display='block'; roleQuizResult.textContent = `Result: ${pct}% (${correct}/${qset.length})`; try{ localStorage.setItem('quiz_' + roleKey, pct); }catch(e){} });

})();
