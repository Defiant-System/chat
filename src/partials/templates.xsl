<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
		<xsl:sort order="ascending" select="@cstamp"/>
		<div class="team">
			<xsl:attribute name="title"><xsl:value-of select="@name"/></xsl:attribute>
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="not(@img)">
				<xsl:attribute name="data-name"><xsl:value-of select="@short"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@img">
				<xsl:attribute name="style">
					background-image: url(<xsl:value-of select="@img"/>);
					background-color: transparent;
				</xsl:attribute>
			</xsl:if>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="threads">
	<xsl:variable name="teamId" select="@id"/>
	<xsl:for-each select="./*">
		<xsl:choose>
			<xsl:when test="name() = 'Contacts'">
				<div class="friends">
					<xsl:call-template name="friends">
						<xsl:with-param name="teamId" select="$teamId" />
					</xsl:call-template>
				</div>
			</xsl:when>
			<xsl:when test="name() = 'Channels'">
				<div class="channels">
					<xsl:call-template name="channels">
						<xsl:with-param name="teamId" select="$teamId" />
					</xsl:call-template>
				</div>
			</xsl:when>
			<xsl:when test="name() = 'Members'">
				<div class="members">
					<xsl:call-template name="members">
						<xsl:with-param name="teamId" select="$teamId" />
					</xsl:call-template>
				</div>
			</xsl:when>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="friends">
	<xsl:param name="teamId" />
	<h2>Friends</h2>

	<div class="friends-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="descending" select="@online"/>
			<xsl:sort order="ascending" select="@name"/>
			<li class="friend" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>::<xsl:value-of select="@id"/></xsl:attribute>
				<xsl:if test="@online = 1">
					<xsl:attribute name="class">friend online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
					<xsl:if test="@me = 'true'"><span>(you)</span></xsl:if>
				</div>
			</li>
		</xsl:for-each>
		<li class="add-friend" data-click="add-friend">
			<i class="icon-plus"></i>Add Friend(s)
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="channels">
	<xsl:param name="teamId" />
	<h2 data-click="toggle-channels"><i class="icon-chevron-left"></i>Channels</h2>
	
	<div class="channels-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="ascending" select="@cstamp"/>
			<li class="channel" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>::<xsl:value-of select="@id"/></xsl:attribute>
				<i class="icon-thread"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
				</div>
			</li>
		</xsl:for-each>
		<li class="add-channel" data-click="add-channel">
			<i class="icon-plus"></i>Add a channel
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="members">
	<xsl:param name="teamId" />
	<h2 data-click="toggle-members"><i class="icon-chevron-left"></i>Members</h2>

	<div class="members-list"><ul>
		<xsl:for-each select="./*">
			<xsl:sort order="ascending" select="//Contacts/i[@id = current()/@id]/@name"/>
			<xsl:variable name="user" select="//Contacts/i[@id = current()/@id]"/>
			<li class="member" data-click="select-thread">
				<xsl:attribute name="data-id"><xsl:value-of select="$teamId"/>::<xsl:value-of select="@id"/></xsl:attribute>
				<xsl:if test="$user/@online = 1">
					<xsl:attribute name="class">member online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="$user/@name"/>
				</div>
			</li>
		</xsl:for-each>
		<li class="add-member" data-click="add-member">
			<i class="icon-plus"></i>Invite people
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="empty-room">
	<div class="initial-message">
		<i class="icon-info"></i> There is no previous message in this channel / room. 
		Type in a first message now.
	</div>
</xsl:template>

<xsl:template name="transcripts">
	<xsl:if test="count(./*) = 0">
		<xsl:call-template name="empty-room" />
	</xsl:if>
	<xsl:for-each select="./*">
		<xsl:sort order="ascending" select="@cstamp"/>
		<xsl:call-template name="message"/>
	</xsl:for-each>
</xsl:template>

<xsl:template name="message">
	<xsl:variable name="me" select="//Contacts/i[@me = 'true']"/>
	<xsl:variable name="user" select="//Contacts/i[@id = current()/@from]"/>
	<div>
		<xsl:attribute name="class">message <xsl:choose>
			<xsl:when test="@from = $me/@id">sent</xsl:when>
			<xsl:otherwise>received</xsl:otherwise>
		</xsl:choose></xsl:attribute>
		<div class="msg-wrapper">
			<div class="avatar">
				<xsl:attribute name="data-name"><xsl:value-of select="$user/@short"/></xsl:attribute>
			</div>
			<div class="date"><xsl:value-of select="@timestamp"/></div>
			<xsl:value-of select="." disable-output-escaping="yes"/>
		</div>
	</div>
</xsl:template>

<xsl:template name="info">
	<div class="info-body">
		<div class="profile">
			<div class="avatar" style="background-image: url(~/img/hbi.jpg);"></div>
			<h2>Hakan Bilgin</h2>
		</div>

		<div class="field">
			<span>Nickname</span>
			<span>hbi</span>
		</div>

		<div class="field">
			<span>Phone</span>
			<span>+46(8) 622 07 07</span>
		</div>
	</div>
</xsl:template>
