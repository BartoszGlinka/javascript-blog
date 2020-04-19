const templates = {
	articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
	tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
	authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
	tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
	authorListLink: Handlebars.compile(document.querySelector('#template-author-List-Link').innerHTML),
}

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
  
  const opts = {
    ArticleSelector: '.post',
	TitleSelector: '.post-title',
	TitleListSelector: '.titles',
	ArticleTagsSelector: '.post-tags .list',
	LinksTagSelector: '.list a',
	ArticleAuthorSelector: '.post-author',
    LinksAuthorSelector: '.post-author a',
    TagsListSelector: '.tags.list',
    AuthorsListSelector: '.tags.authors',
    CloudClassCount: 5,
    CloudClassPrefix: 'tag-size-'
  };

  generateTitleLinks()
 
  function generateTitleLinks(customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(opts.TitleListSelector)
    titleList.innerHTML = ''
	
    /* for each article */
    const articles = document.querySelectorAll(opts.ArticleSelector + customSelector)
    let html = ''

    for (const article of articles) {
    /* get the article id */
      const articleId = article.getAttribute('id')
      /* find the title element */ /* get the title from the title element */
      const articleTitle = article.querySelector(opts.TitleSelector).innerHTML
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleID + '"><span>' + articleTitle + '</span></a></li>'
	  const linkHTMLData = {id: articleId, title: articleTitle}
	  
	  const linkHTML = templates.articleLink(linkHTMLData)
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
  
  function calculateTagsParams(tags) {
	const params = {
		max: 0,
		min: 99999,
	}
	for(let tag in tags){
		params.max = Math.max(tags[tag], params.max)
		params.min = Math.min(tags[tag], params.min)
	}

    return params
  }
  
  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min
	const normalizedMax = params.max - params.min
	const percentage = normalizedCount / normalizedMax
	const classNumber = Math.floor( percentage * (opts.CloudClassCount - 1) + 1 )
	return (opts.CloudClassPrefix + classNumber)
  }
	
  function generateTags() {
	/* [NEW] create a new variable allTags with an empty array */
	let allTags = {}
	
    /* find all articles */
    const articles = document.querySelectorAll(opts.ArticleSelector)

    /* START LOOP: for every article: */
    for (const article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.ArticleTagsSelector)

      /* make html variable with empty string */
      let html = ''

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags')

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ')
      /* START LOOP: for each tag */
      for (const tag of articleTagsArray) {
        /* generate HTML of the link */

		const linkHTMLData = {id: tag, title: tag};
	
		const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html = html + linkHTML 
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
	/* [NEW] add html from allTags to tagList */
    const tagsParams = calculateTagsParams(allTags)
	
    //let allTagsHTML = ''
	const allTagsData = {tags: []};
	/* [NEW] START LOOP: for each tag in allTags: */
	for(let tag in allTags){
		/*[NEW] generate code of a link and add it to allTagsHTML */
		const tagLinkHTML = '<a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) +'" >' + tag

		//allTagsHTML += tagLinkHTML
		allTagsData.tags.push({
		  tag: tag,
		  count: allTags[tag],
		  className: calculateTagClass(allTags[tag], tagsParams)
		});
	}
		/*[NEW] add HTML from allTagsHTML to tagList*/
		//tagList.innerHTML = allTagsHTML;
	  	tagList.innerHTML = templates.tagCloudLink(allTagsData)
	  	//console.log(allTagsData)
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
    const allLinksTags = document.querySelectorAll(opts.LinksTagSelector)

    for (const allLinksTag of allLinksTags) {
      allLinksTag.addEventListener('click', tagClickHandler)
    }
  }

  function generateAuthors() {

	let allAuthors = {}
	
    const articles = document.querySelectorAll(opts.ArticleSelector)
    
	for(let article of articles) {
 
		const authorWrappers = article.querySelector(opts.ArticleAuthorSelector) 

		const authorData = article.getAttribute('data-author')
		
		const linkHTMLData = {id: authorData, title: authorData};
		
		const linkHtml = templates.authorLink(linkHTMLData);

		const authorList = document.querySelector('.authors');
		
		authorWrappers.insertAdjacentHTML('afterbegin', linkHtml)
		
		if(!allAuthors[authorData]) {
			allAuthors[authorData] = 1;
		} else {
			allAuthors[authorData]++;
		}
	
		//let allAuthorsHTML = ''
		const allAuthorsData = {author: []};

		for(let author in allAuthors){
			//allAuthorsHTML = allAuthorsHTML+ '<a href="#author-' + author + '">' + author + ' ' +'(' + allAuthors[author] + ')</a>'
			allAuthorsData.author.push({
  				author: author,
				count: allAuthors[authorData],
  				//className: calculateTagClass(allAuthors[author])
			});
		}
		authorList.innerHTML = templates.authorListLink(allAuthorsData);
		console.log(authorList)
		//console.log(allAuthorsData)
	}
  }
	
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
 
	const link = href.replace('#author-', '') // never used
	
	generateTitleLinks('[data-author = "'+link+'"]')
  }
 
  function addClickListenersToAuthors(){
   
    const allLinksAuthors = document.querySelectorAll(opts.LinksAuthorSelector)
	
    for(const allLinksAuthor of allLinksAuthors) {
		allLinksAuthor.addEventListener('click', authorClickHandler)
    }
  } //DONE
   
  addClickListenersToTags()
	
  addClickListenersToAuthors()
}