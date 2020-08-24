<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
	
	</xsl:for-each>
</xsl:template>

<xsl:template name="transcripts">
	<xsl:variable name="me" select="//Contacts/i[@me = 'true']"/>
	<xsl:for-each select="./*">
		<xsl:variable name="user" select="//Contacts/i[@id = current()/@from]"/>
		<div>
			<xsl:attribute name="class">message <xsl:choose>
				<xsl:when test="@from = $me/@id">sent</xsl:when>
				<xsl:otherwise>received</xsl:otherwise>
			</xsl:choose></xsl:attribute>
			<div class="avatar">
				<xsl:attribute name="data-name"><xsl:value-of select="$user/@short"/></xsl:attribute>
			</div>
			<div class="date"><xsl:value-of select="@timestamp"/></div>
			<xsl:value-of select="." disable-output-escaping="yes"/>
		</div>
	</xsl:for-each>
</xsl:template>
