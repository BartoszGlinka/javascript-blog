'use strict';
{
  const titleClickHandler = function(event) {
    event.preventDefault()
    const clickedElement = this

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active')

    for (const activeLink of activeLinks) {
      activeLink.classList.remove('active')
    }

    /* [DONE] add class 'active' to the clicked link */

    clickedElement.classList.add('active')

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts .active')

    for (const activeArticle of activeArticles) {
      activeArticle.classList.remove('active')
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href')

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector)

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active')
  }
  
  const optArticleSelector = '.post'
  const optTitleSelector = '.post-title'
  const optTitleListSelector = '.titles'
  const optArticleTagsSelector = '.post-tags .list'
  const optLinksTagSelector = '.list a'
  const optArticleAuthorSelector = '.post-author'
  const optLinksAuthorSelector = '.post-author a'
  const optTagsListSelector = '.tags.list' //never used
  const optCloudClassCount = 5
  const optCloudClassPrefix = 'tag-size-'

  generateTitleLinks()
 
  function generateTitleLinks(customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector)
    titleList.innerHTML = ''
	
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector)
    let html = ''

    for (const article of articles) {
    /* get the article id */
      const articleID = article.getAttribute('id')
      /* find the title element */ /* get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>'
      /* insert link into titleList */
      titleList.insertAdjacentHTML('afterbegin', linkHTML)
      html = html + linkHTML
	
    }

    titleList.innerHTML = html

    const links = document.querySelectorAll('.titles a')

    for (const link of links) {
      link.addEventListener('click', titleClickHandler)
    }
  }
  generateTitleLinks()
  
  calculateTagsParams()
  
  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min
	const normalizedMax = params.max - params.min
	const percentage = normalizedCount / normalizedMax
	const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 )
	return (optCloudClassPrefix + classNumber)
  }
	
  function generateTags(tag) {
	/* [NEW] create a new variable allTags with an empty array */
	let allTags = {}
	
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector)

    /* START LOOP: for every article: */
    for (const article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector)

      /* make html variable with empty string */
      let html = ''

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags')

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ')
      /* START LOOP: for each tag */
      for (const tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>'
        /* add generated code to html variable */
        html = html + linkHTML
		console.log(html)  
		/* [NEW] check if this link is NOT already in allTags */
		if(!allTags[tag]) {
		/* [NEW] add tag to allTags object */
			allTags[tag] = 1
		} else {
			allTags[tag]++
		}
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.insertAdjacentHTML('afterbegin', html)
    /* END LOOP: for every article: */
	}
	/* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags')
    /*[NEW] create variable for all links HTML code */
	
    const tagsParams = calculateTagsParams(allTags)
	
    console.log('tagsParams:', tagsParams)
	
    let allTagsHTML = '' //never used

		/* [NEW] START LOOP: for each tag in allTags: */
    for(let alltag in allTags){
      /*[NEW] generate code of a link and add it to allTagsHTML*/
		const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams)

		console.log('tagLinkHTML:', tagLinkHTML)

		allTagsHTML += tagLinkHTML
    }
	
	console.log(allTags)
	/* [NEW] END LOOP: for each tag in allTags: */

	/*[NEW] add HTML from allTagsHTML to tagList */
	tagList.innerHTML = allTagsHTML;
    
  }
  
  function calculateTagsParams(tags) {
	const params = {
		max: 0,
		min: 99999,
	}
	for(let tag in tags){
		params.max = Math.max(tags[tag], params.max)
		params.min = Math.min(tags[tag], params.min)
		console.log(tag + ' is used ' + tags[tag] + ' times')
	}

    return params
  }
	
  generateTags()

  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault()
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href') //
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const tagsActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]')
    /* START LOOP: for each active tag link */

    for (const tagsActiveLink of tagsActiveLinks) {
      /* remove class active */
      tagsActiveLink.classList.remove('active')
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const allTagLinks = document.querySelectorAll('a[href="' + href + '"]')
    /* START LOOP: for each found tag link */
    for (const allTagLink of allTagLinks) {
      /* add class active */
      allTagLink.classList.add('active')
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]')
  }

  function addClickListenersToTags() {
    const allLinksTags = document.querySelectorAll(optLinksTagSelector)

    for (const allLinksTag of allLinksTags) {
      allLinksTag.addEventListener('click', tagClickHandler)
    }
  }

  function generateAuthors() {
   
    const articles = document.querySelectorAll(optArticleSelector)
    
	for(let article of articles) {
 
		const authorWrappers = article.querySelector(optArticleAuthorSelector) 
		
		console.log (authorWrappers)
		
		const authorData = article.getAttribute('data-author')
		
		console.log (authorData)

		const linkHtml = '<a href="#author-' + authorData + '">'+ 'by' + ' ' + authorData + '</a>'

		authorWrappers.insertAdjacentHTML('afterbegin', linkHtml)
		
		console.log(authorWrappers)
		console.log(linkHtml)
    }
				
  } //DONE
	
  generateAuthors()
  
  function authorClickHandler(event){

    event.preventDefault();
    
	const clickedElement = this
	
	const href = clickedElement.getAttribute('href')
 
	const authorActiveLinks = document.querySelectorAll('a.active[href^="#author-"]')

	for(const authorActiveLink of authorActiveLinks) {

		authorActiveLink.classList.remove('active');
    }

    const allauthorLinks = document.querySelectorAll('a[href="' + href + '"]')

    for (const allauthorLink of allauthorLinks) {

		allauthorLink.classList.add('active');
    }
	console.log(allauthorLinks)
 
	const link = href.replace('#author-', '') // never used
	
	generateTitleLinks('[data-author = "'+link+'"]')
  }
 
  function addClickListenersToAuthors(){
   
    const allLinksAuthors = document.querySelectorAll(optLinksAuthorSelector)
	console.log(allLinksAuthors)
    for(const allLinksAuthor of allLinksAuthors) {
		allLinksAuthor.addEventListener('click', authorClickHandler)
    }
  } //DONE
   
  addClickListenersToTags()
	
  addClickListenersToAuthors()
}