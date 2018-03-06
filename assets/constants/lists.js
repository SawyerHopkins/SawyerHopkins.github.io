import MTU from '~/assets/media/mtu2.png'
import KState from '~/assets/media/kstate2.png'
import ImportIO from '~/assets/media/import.png'
import Piestar from '~/assets/media/piestar.png'
import Research from '~/assets/media/research.png'
import Radiowave from '~/assets/media/radiowave.png'

export const JOBS = [
  { id: "rw", name: 'Radiowave.io', position: 'Senior Lead Javascript Engineer', date: '2018-Present', img: Radiowave },
  { id: "import", name: 'import.io', position: 'Frontend Engineer', date: '2017-Present', img: ImportIO },
  { id: "piestar", name: 'Piestar', position: 'Web Developer', date: '2015-2017', img: Piestar },
  { id: "kstate", name: 'K-State', position: 'Graduate Researcher', date: '2015-2017', img: Research }
]

export const EDUCATION = [
  { id: 'mtu', name: 'Michigan Tech', level: 'B.S. Physics', img: MTU },
  { id: 'kstate', name: 'K-State', level: 'M.S. Physics', img: KState }
]

export const PROJECTS = [
  { id: 'vis', lang: 'JS, Vue', name: 'Vue Image Sizer', demo: '/projects/image-sizer', git: 'https://github.com/SawyerHopkins/vue-image-sizer' },
  { id: 'psim', lang: 'C++', name: 'ProteinSim', demo: '/projects/simulation', git: 'https://github.com/SawyerHopkins/ProteinSim2015' }
]