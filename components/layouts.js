import '../styles/global.css';
import { GLOBAL_NAVIGATION } from '../config/navigation';
/**
 * ========================================
 * PAGE LAYOUTS
 * ========================================
 */

export function SimplePage(props) {
    let { title = '', description = '' } = props;
    return (
        <div style={{ width: '80%', height: '100%', padding: '5px' }}>
            <title>{title}</title>
            {title ? (<h1>{title}</h1>) : ''}
            {description ? (<div>{description}</div>) : ''}
            <br />
            {props.children}
        </div>
    )
}

export function NavPage(props) {
    /** @type {Array<NavigationSection>} */
    let navigation = props.navigation || createNavPageNavigationPropsGlobal();
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                {/*START OF NAVIGATION*/}
                <div style={{ backgroundColor: '#F0F0F0FF', width: '20%', minWidth: '200px', padding: '5px' }}>
                    {navigation.map(section => {
                        let { title: section_title, nodes } = section;
                        return (
                            <div key={section_title}>
                                <div>{section_title}</div>
                                {nodes.map(node => {
                                    let { link, title } = node;
                                    return (
                                        <div key={link}>
                                            <button style={{ width: '100%' }}>
                                                <a href={link} style={{ width: '100%', display: 'inline-block', textDecoration: 'none' }}>{title}</a>
                                            </button>
                                        </div>)
                                })}
                                <br/>
                            </div>
                        )
                    })}
                </div>
                {/*END OF NAVIGATION*/}
                <SimplePage {...props}>
                    {props.children}
                </SimplePage>
            </div>
        </div>
    )
}
/**
 * ========================================
 * HELPERS
 * ========================================
 */
/**
 * Creates props for navigation
 * @param {Array<NavigationSection>} sections 
 */
export function createNavPageNavigationProps(sections) {
    let fn = 'createNavigationProps';
    for (let section of sections) {
        let { title, nodes } = section;
        for (let node of nodes) {
            let { title, link } = node;
            if (!title) {
                console.warn(`${fn}: Navigation node missing property 'title'`);
            }
            if (!link) {
                console.warn(`${fn}: Navigation node missing property 'link'`);
            }
        }
    }
    return sections;
}

export function createNavPageNavigationPropsGlobal() {
    return createNavPageNavigationProps(GLOBAL_NAVIGATION);
}

/**
 * @typedef NavigationNode
 * @property {string} title
 * @property {string} link
 */

/**
 * @typedef NavigationSection
 * @property {string} title
 * @property {Array<NavigationNode>} nodes
 */