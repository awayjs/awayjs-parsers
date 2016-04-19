import Sampler2D				from "awayjs-core/lib/image/Sampler2D";
import BitmapImage2D			from "awayjs-core/lib/image/BitmapImage2D";
import Rectangle				from "awayjs-core/lib/geom/Rectangle";
import IAsset					from "awayjs-core/lib/library/IAsset";
import URLLoaderDataFormat		from "awayjs-core/lib/net/URLLoaderDataFormat";
import URLRequest				from "awayjs-core/lib/net/URLRequest";
import ParserBase				from "awayjs-core/lib/parsers/ParserBase";
import ParserUtils				from "awayjs-core/lib/parsers/ParserUtils";
import ResourceDependency		from "awayjs-core/lib/parsers/ResourceDependency";
import XmlUtils					from "awayjs-core/lib/utils/XmlUtils";

/**
 * TextureAtlasParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
 * a loader object, it wraps it in a BitmapImage2DResource so resource management can happen consistently without
 * exception cases.
 */
class FNTParser extends ParserBase
{
	private _doc:Node;
	private _imagePath:string;
	private _imageData:BitmapImage2D;
	private _chars:NodeList;
	private _parseState:number = 0;

	/**
	 * Creates a new TextureAtlasParser object.
	 * @param uri The url or id of the data or file to be parsed.
	 * @param extra The holder for extra contextual data that the parser might need.
	 */
	constructor()
	{
		super(URLLoaderDataFormat.TEXT);
	}

	/**
	 * Indicates whether or not a given file extension is supported by the parser.
	 * @param extension The file extension of a potential file to be parsed.
	 * @return Whether or not the given file type is supported.
	 */

	public static supportsType(extension:string):boolean
	{
		extension = extension.toLowerCase();
		return extension == "fnt";
	}

	/**
	 * Tests whether a data block can be parsed by the parser.
	 * @param data The data block to potentially be parsed.
	 * @return Whether or not the given data is supported.
	 */
	public static supportsData(data:any):boolean
	{
		try {
			var content:string = ParserUtils.toString(data);
			if(content.indexOf("font") != -1 || content.indexOf("Font") != -1)
				return true;

			return false;
		} catch (e) {
			return false;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependency(resourceDependency:ResourceDependency)
	{
		if(resourceDependency.assets.length) {
			this._imageData = <BitmapImage2D> resourceDependency.assets[0];
			this._pFinalizeAsset(this._imageData);
			this._parseState = FNTParserState.PARSE_CHARS;
		} else {
			this._parseState = FNTParserState.PARSE_COMPLETE;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iResolveDependencyFailure(resourceDependency:ResourceDependency)
	{
		this._parseState = FNTParserState.PARSE_COMPLETE;
	}

	/**
	 * @inheritDoc
	 */
	public _pProceedParsing():boolean
	{
		var nodes:NodeList;

		switch(this._parseState) {
			case FNTParserState.PARSE_XML:
				try {
					this._doc = XmlUtils.getChildrenWithTag(XmlUtils.strToXml(this._pGetTextData()), "font")[0];

					this._imagePath = XmlUtils.readAttributeValue(this._doc, "imagePath");

					this._chars = XmlUtils.getChildrenWithTag(this._doc, "chars");

					this._parseState = FNTParserState.PARSE_IMAGE;

				} catch(Error) {
					return ParserBase.PARSING_DONE;
				}
				break;

			case FNTParserState.PARSE_IMAGE:
				if (this._imagePath){
					this._pAddDependency(this._imagePath, new URLRequest(this._imagePath));
					this._pPauseAndRetrieveDependencies();
				} else {
					return ParserBase.PARSING_DONE;
				}

				break;

			case FNTParserState.PARSE_CHARS:
				var sampler:Sampler2D;
				var element:Node;
				var x:string;
				var y:string;
				var width:string;
				var height:string;
				var len:number = this._chars.length;
				for (var i:number = 0; i < len; i++) {
					element = this._chars[i];
					sampler = new Sampler2D();

					//setup subtexture rect
					x = XmlUtils.readAttributeValue(element, "x");
					y = XmlUtils.readAttributeValue(element, "y");
					width = XmlUtils.readAttributeValue(element, "width");
					height = XmlUtils.readAttributeValue(element, "height");
					if (x || y || width || height)
						sampler.imageRect = new Rectangle(parseInt(x)/this._imageData.width, parseInt(y)/this._imageData.height, parseInt(width)/this._imageData.width, parseInt(height)/this._imageData.height);

					//setup frame rect
					x = XmlUtils.readAttributeValue(element, "frameX");
					y = XmlUtils.readAttributeValue(element, "frameY");
					width = XmlUtils.readAttributeValue(element, "frameWidth");
					height = XmlUtils.readAttributeValue(element, "frameHeight");
					if (x || y || width || height)
						sampler.frameRect = new Rectangle(parseInt(x), parseInt(y), parseInt(width), parseInt(height));

					this._pFinalizeAsset(sampler, XmlUtils.readAttributeValue(element, "name"));
				}

				this._parseState = FNTParserState.PARSE_COMPLETE;

				break;

			case FNTParserState.PARSE_COMPLETE:
				return ParserBase.PARSING_DONE;
		}

		return ParserBase.MORE_TO_PARSE;
	}
}

export default FNTParser;

class FNTParserState {
	public static PARSE_XML:number = 0;
	public static PARSE_IMAGE:number = 1;
	public static PARSE_CHARS:number = 2;
	public static PARSE_COMPLETE:number = 3;
}