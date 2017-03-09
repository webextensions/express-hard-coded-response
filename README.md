## Functions

<dl>
<dt><a href="#hardCodedResponse">hardCodedResponse(options)</a> ⇒ <code><a href="#ExpressMiddleware">ExpressMiddleware</a></code></dt>
<dd><p>This function is an Express JS middleware which would try to match the specified pattern (from an array of MatchCondition objects)
with req.originalUrl.
<br /> - If no match is found, then the request would just pass through.
<br /> - If a match is found, then serve the corresponding file (specified in the MatchCondition object) as its hard-coded response.
<br />
<br /> Note: res.locals[&#39;matchedCondition&#39;] is set as per the first-matched-condition</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ExpressMiddleware">ExpressMiddleware</a> : <code>function</code></dt>
<dd><p>Express middleware</p>
</dd>
<dt><a href="#MatchCondition">MatchCondition</a> : <code>Object</code></dt>
<dd><p>The condition to be matched (<b>.pattern</b> is used for match with request and other attributes are used for response)</p>
</dd>
</dl>

<a name="hardCodedResponse"></a>

## hardCodedResponse(options) ⇒ <code>[ExpressMiddleware](#ExpressMiddleware)</code>
This function is an Express JS middleware which would try to match the specified pattern (from an array of MatchCondition objects)
with req.originalUrl.
<br /> - If no match is found, then the request would just pass through.
<br /> - If a match is found, then serve the corresponding file (specified in the MatchCondition object) as its hard-coded response.
<br />
<br /> Note: res.locals['matchedCondition'] is set as per the first-matched-condition

**Kind**: global function  
**Returns**: <code>[ExpressMiddleware](#ExpressMiddleware)</code> - Express middleware  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.conditions] | <code>[Array.&lt;MatchCondition&gt;](#MatchCondition)</code> |  | Array of conditions which would be used for matching with req.originalUrl                                                        <br /> A <b>falsy-value</b> (or empty array) would make this function call effectively empty and the request would pass-through |
| [options.verbose] | <code>Boolean</code> | <code>false</code> | <b>truthy-value</b> to log each matched URL and corresponding pattern |
| [options.baseDir] | <code>Object</code> | <code>&quot;&lt;empty-string&gt;&quot;</code> | Base directory for the relative paths |
| [options.debugNote] | <code>Object</code> | <code>&quot;This is a hard-coded response intended for debugging purposes only&quot;</code> | Debug note to be added as HTTP header (and JSON property if MatchCondition says .type is 'json')                                                                                                             <br /> - If responseText & responseFile are not provided in MatchCondition, then debugNote is used as the response                                                                                                             <br /> - Set it to <b>false</b> to disable it |
| [options.console] | <code>Object</code> | <code>console</code> | A <b>logging/console object</b>, which supports .log() and .warn() |

<a name="ExpressMiddleware"></a>

## ExpressMiddleware : <code>function</code>
Express middleware

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>Object</code> | Request object |
| res | <code>Object</code> | Response object |
| next | <code>function</code> | Next function |

<a name="MatchCondition"></a>

## MatchCondition : <code>Object</code>
The condition to be matched (<b>.pattern</b> is used for match with request and other attributes are used for response)

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | <code>String</code> |  | <b>"none"</b> or <b>falsy-value</b> would match none                                               <br /> <b>"*"</b> or <b>"all"</b> would match all                                               <br /> <b>"&lt;any-other-pattern&gt;"</b> would be searched as plain string anywhere in the req.originalUrl |
| status | <code>String</code> | <code>200</code> | Response status |
| type | <code>String</code> |  | Type of response (currently supporting 'json')                                               <br />                                               <br /> <b>If 'json' is used:</b>                                               <br /> - <b>responseFile</b>'s contents would be read as commented-json (CJSON) and the commentes would be stripped-off.                                               <br /> - 'Content-Type' header is set as 'application/json; charset=utf-8' by default, unless overridden using <b>contentType</b> option.                                               <br /> - <b>debugNote</b> would be added as a property to the JSON response (this can be overwritten through the options when setting up the middleware). |
| contentType | <code>String</code> |  | 'Content-Type' header |
| responseText | <code>String</code> |  | The text to be used as the hard-coded response (responseText has more priority than responseFile) |
| responseFile | <code>String</code> |  | The file to be used as the hard-coded response (responseText has more priority than responseFile) |
| Any-other-object-properties | <code>\*</code> |  | Any other object properties (these might be accessed after match from res.locals['matchedCondition']) |

